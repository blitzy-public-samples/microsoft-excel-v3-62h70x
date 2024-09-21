import { CellCoordinate, CellValue, Formula } from 'src/shared/types/index';
import { DEFAULT_DECIMAL_PLACES, DATE_FORMAT, TIME_FORMAT, CURRENCY_SYMBOL } from 'src/shared/constants/index';
import { format } from 'date-fns';

export function convertToColumnName(columnNumber: number): string {
  let columnName = '';
  while (columnNumber > 0) {
    columnNumber--;
    const remainder = columnNumber % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    columnNumber = Math.floor(columnNumber / 26);
  }
  return columnName;
}

export function convertToCellCoordinate(cellReference: string): CellCoordinate {
  const match = cellReference.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error('Invalid cell reference');
  }
  const column = match[1].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
  const row = parseInt(match[2], 10);
  return { row, column };
}

export function formatCellValue(value: CellValue, format: object): string {
  if (typeof value === 'number') {
    if (format.type === 'currency') {
      return formatCurrency(value, format.currencyCode);
    } else if (format.type === 'percentage') {
      return formatPercentage(value, format.decimalPlaces);
    } else {
      return value.toFixed(format.decimalPlaces || DEFAULT_DECIMAL_PLACES);
    }
  } else if (value instanceof Date) {
    return formatDate(value, format.dateFormat);
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  } else {
    return String(value);
  }
}

export function parseFormula(formula: Formula): string[] {
  const tokens: string[] = [];
  const regex = /([A-Z]+\d+|[+\-*/()^]|\d+(\.\d+)?|[A-Z]+(?=\())/g;
  let match;
  while ((match = regex.exec(formula)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

export function evaluateFormula(tokens: string[], cellValues: { [key: string]: CellValue }): CellValue {
  const stack: (number | string)[] = [];
  const operators: { [key: string]: (a: number, b: number) => number } = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '^': (a, b) => Math.pow(a, b)
  };

  for (const token of tokens) {
    if (isValidCellReference(token)) {
      stack.push(cellValues[token] || 0);
    } else if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else if (token in operators) {
      const b = Number(stack.pop());
      const a = Number(stack.pop());
      stack.push(operators[token](a, b));
    }
  }

  return stack[0] as CellValue;
}

export function isValidCellReference(reference: string): boolean {
  return /^[A-Z]+\d+$/.test(reference);
}

export function getCellRange(startCell: string, endCell: string): string[] {
  const start = convertToCellCoordinate(startCell);
  const end = convertToCellCoordinate(endCell);
  const range: string[] = [];

  for (let row = start.row; row <= end.row; row++) {
    for (let col = start.column; col <= end.column; col++) {
      range.push(`${convertToColumnName(col)}${row}`);
    }
  }

  return range;
}

export function formatDate(date: Date, formatString: string = DATE_FORMAT): string {
  return format(date, formatString);
}

export function formatCurrency(value: number, currencyCode: string = CURRENCY_SYMBOL): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(value);
}

export function formatPercentage(value: number, decimalPlaces: number = DEFAULT_DECIMAL_PLACES): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}

export function debounce(func: Function, wait: number): Function {
  let timeoutId: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

export function throttle(func: Function, wait: number): Function {
  let lastExecution = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastExecution >= wait) {
      func.apply(this, args);
      lastExecution = now;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecution = Date.now();
        timeoutId = null;
      }, wait - (now - lastExecution));
    }
  };
}
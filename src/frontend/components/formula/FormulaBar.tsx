import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Input } from 'src/frontend/components/common/Input';
import { Button } from 'src/frontend/components/common/Button';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { useFormulaBarContext, useSelectionContext, useWorksheetContext } from 'src/shared/contexts/index';
import { FormulaBarProps, CellCoordinate } from 'src/shared/types/index';
import { evaluateFormula } from 'src/shared/utils/index';

export const FormulaBar: React.FC<FormulaBarProps> = ({ className }) => {
  const { formulaBarState, updateFormulaBarState } = useFormulaBarContext();
  const { selectedCell } = useSelectionContext();
  const { getCell, updateCell } = useWorksheetContext();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (selectedCell) {
      const cell = getCell(selectedCell);
      setInputValue(cell?.formula || cell?.value?.toString() || '');
    }
  }, [selectedCell, getCell]);

  const containerClassName = classNames('formula-bar', className);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    updateFormulaBarState({ content: newValue });
  };

  const handleInputBlur = () => {
    if (selectedCell) {
      try {
        const result = evaluateFormula(inputValue);
        updateCell(selectedCell, { value: result, formula: inputValue });
      } catch (error) {
        console.error('Formula evaluation error:', error);
        // TODO: Display error message to user
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    } else if (event.key === 'Escape') {
      setInputValue('');
      updateFormulaBarState({ content: '' });
    }
  };

  const insertCellReference = (cellRef: CellCoordinate) => {
    const newValue = `${inputValue}${cellRef.column}${cellRef.row}`;
    setInputValue(newValue);
    updateFormulaBarState({ content: newValue });
  };

  return (
    <div className={containerClassName}>
      <div className="cell-reference">
        {selectedCell ? `${selectedCell.column}${selectedCell.row}` : ''}
      </div>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Enter a formula or value"
        className="formula-input"
      />
      <div className="function-buttons">
        <Tooltip content="Insert SUM function">
          <Button onClick={() => insertCellReference({ column: 'SUM(', row: ')' })}>∑</Button>
        </Tooltip>
        <Tooltip content="Insert AVERAGE function">
          <Button onClick={() => insertCellReference({ column: 'AVERAGE(', row: ')' })}>x̄</Button>
        </Tooltip>
        {/* Add more function buttons as needed */}
      </div>
      <div className="formula-result">
        {formulaBarState.evaluationResult || ''}
      </div>
    </div>
  );
};
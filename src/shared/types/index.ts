// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workbook {
  id: string;
  name: string;
  ownerId: string;
  worksheets: Worksheet[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Worksheet {
  id: string;
  name: string;
  workbookId: string;
  cells: Cell[][];
  charts: Chart[];
}

export interface Cell {
  coordinate: CellCoordinate;
  value: CellValue;
  formula: Formula;
  style: object;
}

export interface Chart {
  id: string;
  name: string;
  type: ChartType;
  dataRange: CellRange;
  options: object;
}

export interface CellCoordinate {
  row: number;
  column: number;
}

export interface CellRange {
  start: CellCoordinate;
  end: CellCoordinate;
}

// Types
export type CellValue = string | number | boolean | null;
export type Formula = string;

// Enums
export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  SCATTER = 'SCATTER',
  AREA = 'AREA',
  COLUMN = 'COLUMN'
}

export enum Permission {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  COMMENT = 'COMMENT',
  OWNER = 'OWNER'
}
import { ChartType, Permission } from '../types';

export const MAX_ROWS: number = 1048576;
export const MAX_COLUMNS: number = 16384;

export const DEFAULT_FONT: string = 'Calibri';
export const DEFAULT_FONT_SIZE: number = 11;

export const DEFAULT_CELL_WIDTH: number = 64;
export const DEFAULT_CELL_HEIGHT: number = 20;

export const DEFAULT_DECIMAL_PLACES: number = 2;

export const DATE_FORMAT: string = 'YYYY-MM-DD';
export const TIME_FORMAT: string = 'HH:mm:ss';

export const CURRENCY_SYMBOL: string = '$';

export const DEFAULT_CHART_WIDTH: number = 400;
export const DEFAULT_CHART_HEIGHT: number = 300;

export const API_BASE_URL: string = 'https://api.excel.microsoft.com/v1';

export const TOKEN_KEY: string = 'excel_auth_token';
export const REFRESH_TOKEN_KEY: string = 'excel_refresh_token';

export const DEFAULT_THEME: string = 'light';

export const AUTOSAVE_INTERVAL: number = 60000; // 60 seconds

export const MAX_UNDO_STEPS: number = 100;

export const CHART_COLORS: string[] = [
  '#4285F4',
  '#DB4437',
  '#F4B400',
  '#0F9D58',
  '#AB47BC',
  '#00ACC1',
  '#FF7043',
  '#9E9E9E'
];

export const PERMISSION_LEVELS: Permission[] = [
  'VIEW',
  'EDIT',
  'COMMENT',
  'OWNER'
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_INPUT: 'Invalid input. Please check your data and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
};
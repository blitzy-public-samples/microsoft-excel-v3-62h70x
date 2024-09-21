import { createContext, useContext } from 'react';
import { Workbook, Worksheet, Cell, CellCoordinate } from 'src/shared/types/index';
import {
  useWorkbook,
  useWorksheet,
  useCell,
  useSelection,
  useUndo,
  useFormulaBar,
  useClipboard
} from 'src/shared/hooks/index';

// Define context types
type WorkbookContextType = ReturnType<typeof useWorkbook>;
type WorksheetContextType = ReturnType<typeof useWorksheet>;
type CellContextType = ReturnType<typeof useCell>;
type SelectionContextType = ReturnType<typeof useSelection>;
type UndoContextType = ReturnType<typeof useUndo>;
type FormulaBarContextType = ReturnType<typeof useFormulaBar>;
type ClipboardContextType = ReturnType<typeof useClipboard>;

// Create contexts
export const WorkbookContext = createContext<WorkbookContextType | undefined>(undefined);
export const WorksheetContext = createContext<WorksheetContextType | undefined>(undefined);
export const CellContext = createContext<CellContextType | undefined>(undefined);
export const SelectionContext = createContext<SelectionContextType | undefined>(undefined);
export const UndoContext = createContext<UndoContextType | undefined>(undefined);
export const FormulaBarContext = createContext<FormulaBarContextType | undefined>(undefined);
export const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

// Custom hooks to use contexts
export function useWorkbookContext() {
  const context = useContext(WorkbookContext);
  if (context === undefined) {
    throw new Error('useWorkbookContext must be used within a WorkbookProvider');
  }
  return context;
}

export function useWorksheetContext() {
  const context = useContext(WorksheetContext);
  if (context === undefined) {
    throw new Error('useWorksheetContext must be used within a WorksheetProvider');
  }
  return context;
}

export function useCellContext() {
  const context = useContext(CellContext);
  if (context === undefined) {
    throw new Error('useCellContext must be used within a CellProvider');
  }
  return context;
}

export function useSelectionContext() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
}

export function useUndoContext() {
  const context = useContext(UndoContext);
  if (context === undefined) {
    throw new Error('useUndoContext must be used within an UndoProvider');
  }
  return context;
}

export function useFormulaBarContext() {
  const context = useContext(FormulaBarContext);
  if (context === undefined) {
    throw new Error('useFormulaBarContext must be used within a FormulaBarProvider');
  }
  return context;
}

export function useClipboardContext() {
  const context = useContext(ClipboardContext);
  if (context === undefined) {
    throw new Error('useClipboardContext must be used within a ClipboardProvider');
  }
  return context;
}
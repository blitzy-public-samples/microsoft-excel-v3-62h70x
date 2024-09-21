import { useState, useEffect, useCallback, useRef } from 'react';
import { Workbook, Worksheet, Cell, CellCoordinate } from 'src/shared/types/index';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { WorksheetService } from 'src/backend/services/WorksheetService';
import { CellService } from 'src/backend/services/CellService';
import { AUTOSAVE_INTERVAL } from 'src/shared/constants/index';
import { debounce, throttle } from 'src/shared/utils/index';

export const useWorkbook = (workbookId: string) => {
  const [workbook, setWorkbook] = useState<Workbook | null>(null);

  useEffect(() => {
    const fetchWorkbook = async () => {
      try {
        const data = await WorkbookService.getWorkbook(workbookId);
        setWorkbook(data);
      } catch (error) {
        console.error('Error fetching workbook:', error);
      }
    };
    fetchWorkbook();
  }, [workbookId]);

  const updateWorkbookProperty = useCallback(async (property: keyof Workbook, value: any) => {
    if (!workbook) return;
    try {
      const updatedWorkbook = await WorkbookService.updateWorkbook(workbookId, { [property]: value });
      setWorkbook(updatedWorkbook);
    } catch (error) {
      console.error('Error updating workbook:', error);
    }
  }, [workbook, workbookId]);

  const addWorksheet = useCallback(async (name: string) => {
    if (!workbook) return;
    try {
      const newWorksheet = await WorkbookService.addWorksheet(workbookId, name);
      setWorkbook(prev => prev ? { ...prev, worksheets: [...prev.worksheets, newWorksheet] } : null);
    } catch (error) {
      console.error('Error adding worksheet:', error);
    }
  }, [workbook, workbookId]);

  const removeWorksheet = useCallback(async (worksheetId: string) => {
    if (!workbook) return;
    try {
      await WorkbookService.removeWorksheet(workbookId, worksheetId);
      setWorkbook(prev => prev ? { ...prev, worksheets: prev.worksheets.filter(w => w.id !== worksheetId) } : null);
    } catch (error) {
      console.error('Error removing worksheet:', error);
    }
  }, [workbook, workbookId]);

  return { workbook, updateWorkbookProperty, addWorksheet, removeWorksheet };
};

export const useWorksheet = (workbookId: string, worksheetId: string) => {
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);

  useEffect(() => {
    const fetchWorksheet = async () => {
      try {
        const data = await WorksheetService.getWorksheet(workbookId, worksheetId);
        setWorksheet(data);
      } catch (error) {
        console.error('Error fetching worksheet:', error);
      }
    };
    fetchWorksheet();
  }, [workbookId, worksheetId]);

  const updateWorksheetProperty = useCallback(async (property: keyof Worksheet, value: any) => {
    if (!worksheet) return;
    try {
      const updatedWorksheet = await WorksheetService.updateWorksheet(workbookId, worksheetId, { [property]: value });
      setWorksheet(updatedWorksheet);
    } catch (error) {
      console.error('Error updating worksheet:', error);
    }
  }, [worksheet, workbookId, worksheetId]);

  const updateCell = useCallback(async (coordinate: CellCoordinate, value: any) => {
    try {
      await CellService.updateCell(workbookId, worksheetId, coordinate, value);
      setWorksheet(prev => {
        if (!prev) return null;
        const updatedCells = [...prev.cells];
        const cellIndex = updatedCells.findIndex(cell => 
          cell.coordinate.row === coordinate.row && cell.coordinate.column === coordinate.column
        );
        if (cellIndex !== -1) {
          updatedCells[cellIndex] = { ...updatedCells[cellIndex], value };
        } else {
          updatedCells.push({ coordinate, value });
        }
        return { ...prev, cells: updatedCells };
      });
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  }, [workbookId, worksheetId]);

  return { worksheet, updateWorksheetProperty, updateCell };
};

export const useCell = (workbookId: string, worksheetId: string, coordinate: CellCoordinate) => {
  const [cell, setCell] = useState<Cell | null>(null);

  useEffect(() => {
    const fetchCell = async () => {
      try {
        const data = await CellService.getCell(workbookId, worksheetId, coordinate);
        setCell(data);
      } catch (error) {
        console.error('Error fetching cell:', error);
      }
    };
    fetchCell();
  }, [workbookId, worksheetId, coordinate]);

  const updateCellValue = useCallback(async (value: any) => {
    try {
      const updatedCell = await CellService.updateCell(workbookId, worksheetId, coordinate, value);
      setCell(updatedCell);
    } catch (error) {
      console.error('Error updating cell value:', error);
    }
  }, [workbookId, worksheetId, coordinate]);

  const updateCellStyle = useCallback(async (style: Partial<Cell['style']>) => {
    if (!cell) return;
    try {
      const updatedCell = await CellService.updateCellStyle(workbookId, worksheetId, coordinate, style);
      setCell(updatedCell);
    } catch (error) {
      console.error('Error updating cell style:', error);
    }
  }, [cell, workbookId, worksheetId, coordinate]);

  return { cell, updateCellValue, updateCellStyle };
};

export const useAutoSave = (saveFunction: () => Promise<void>, interval: number = AUTOSAVE_INTERVAL) => {
  const saveFunctionRef = useRef(saveFunction);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  useEffect(() => {
    saveFunctionRef.current = saveFunction;
  }, [saveFunction]);

  useEffect(() => {
    if (!isAutoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      saveFunctionRef.current();
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [interval, isAutoSaveEnabled]);

  const toggleAutoSave = useCallback(() => {
    setIsAutoSaveEnabled(prev => !prev);
  }, []);

  const triggerManualSave = useCallback(() => {
    saveFunctionRef.current();
  }, []);

  return { isAutoSaveEnabled, toggleAutoSave, triggerManualSave };
};

export const useUndo = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushState = useCallback((newState: T) => {
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newState]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo]);

  return { 
    state: history[currentIndex], 
    pushState, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  };
};

export const useSelection = () => {
  const [selectedCells, setSelectedCells] = useState<CellCoordinate[]>([]);
  const [activeCell, setActiveCell] = useState<CellCoordinate | null>(null);

  const selectCell = useCallback((coordinate: CellCoordinate) => {
    setSelectedCells([coordinate]);
    setActiveCell(coordinate);
  }, []);

  const selectRange = useCallback((start: CellCoordinate, end: CellCoordinate) => {
    const range: CellCoordinate[] = [];
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.column; col <= end.column; col++) {
        range.push({ row, column: col });
      }
    }
    setSelectedCells(range);
    setActiveCell(end);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCells([]);
    setActiveCell(null);
  }, []);

  return { selectedCells, activeCell, selectCell, selectRange, clearSelection };
};

export const useFormulaBar = () => {
  const [formula, setFormula] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const updateFormula = useCallback((newFormula: string) => {
    setFormula(newFormula);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const endEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const applyFormula = useCallback(async (workbookId: string, worksheetId: string, coordinate: CellCoordinate) => {
    try {
      await CellService.updateCellFormula(workbookId, worksheetId, coordinate, formula);
      endEditing();
    } catch (error) {
      console.error('Error applying formula:', error);
    }
  }, [formula, endEditing]);

  return { formula, isEditing, updateFormula, startEditing, endEditing, applyFormula };
};

export const useClipboard = () => {
  const [clipboardContent, setClipboardContent] = useState<any>(null);

  const cut = useCallback((content: any) => {
    setClipboardContent(content);
    // Implement cut logic here (e.g., clearing the original cells)
  }, []);

  const copy = useCallback((content: any) => {
    setClipboardContent(content);
  }, []);

  const paste = useCallback(async (workbookId: string, worksheetId: string, targetCoordinate: CellCoordinate) => {
    if (!clipboardContent) return;

    try {
      // Implement paste logic here (e.g., updating cells with clipboard content)
      await CellService.pasteCells(workbookId, worksheetId, targetCoordinate, clipboardContent);
    } catch (error) {
      console.error('Error pasting content:', error);
    }
  }, [clipboardContent]);

  return { clipboardContent, cut, copy, paste };
};

// TODO: Implement unit tests for each custom hook
// TODO: Optimize performance for hooks that deal with large datasets
// TODO: Add error handling and validation for input parameters
// TODO: Implement more advanced selection features (e.g., column/row selection)
// TODO: Add support for collaborative editing in relevant hooks
// TODO: Implement hooks for chart creation and manipulation
// TODO: Add accessibility features to relevant hooks (e.g., keyboard navigation in useSelection)
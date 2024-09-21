import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Cell } from 'src/frontend/components/cell/Cell';
import { useWorksheetContext, useSelectionContext, useFormulaBarContext } from 'src/shared/contexts/index';
import { CellCoordinate, CellGridProps } from 'src/shared/types/index';

export const CellGrid: React.FC<CellGridProps> = ({ className }) => {
  const { worksheet } = useWorksheetContext();
  const { selectedCell, setSelectedCell } = useSelectionContext();
  const { updateFormulaBar } = useFormulaBarContext();

  const [visibleCells, setVisibleCells] = useState<CellCoordinate[]>([]);

  const handleCellSelection = useCallback((coordinate: CellCoordinate) => {
    setSelectedCell(coordinate);
    const cellValue = worksheet.cells[coordinate.row][coordinate.column].value;
    updateFormulaBar(cellValue);
  }, [setSelectedCell, updateFormulaBar, worksheet]);

  const handleCellEdit = useCallback((coordinate: CellCoordinate, value: string) => {
    // Update cell value in the worksheet context
    // This is a placeholder and should be implemented in the worksheet context
    console.log(`Editing cell at ${coordinate.row},${coordinate.column} with value: ${value}`);
  }, []);

  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, column } = selectedCell;
    let newRow = row;
    let newColumn = column;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(worksheet.rowCount - 1, row + 1);
        break;
      case 'ArrowLeft':
        newColumn = Math.max(0, column - 1);
        break;
      case 'ArrowRight':
        newColumn = Math.min(worksheet.columnCount - 1, column + 1);
        break;
    }

    if (newRow !== row || newColumn !== column) {
      handleCellSelection({ row: newRow, column: newColumn });
    }
  }, [selectedCell, worksheet, handleCellSelection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

  useEffect(() => {
    // Implement virtual scrolling logic here
    // This is a placeholder and should be replaced with actual implementation
    const visibleRows = 50;
    const visibleColumns = 20;
    const cells: CellCoordinate[] = [];
    for (let row = 0; row < visibleRows; row++) {
      for (let column = 0; column < visibleColumns; column++) {
        cells.push({ row, column });
      }
    }
    setVisibleCells(cells);
  }, [worksheet]);

  const gridClassName = classNames('cell-grid', className);

  return (
    <div className={gridClassName}>
      <div className="column-headers">
        {/* Render column headers (A, B, C, ...) */}
        {Array.from({ length: worksheet.columnCount }, (_, i) => (
          <div key={`col-${i}`} className="column-header">
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div className="row-headers">
        {/* Render row headers (1, 2, 3, ...) */}
        {Array.from({ length: worksheet.rowCount }, (_, i) => (
          <div key={`row-${i}`} className="row-header">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="cells-container">
        {visibleCells.map(({ row, column }) => (
          <Cell
            key={`${row}-${column}`}
            coordinate={{ row, column }}
            value={worksheet.cells[row][column].value}
            isSelected={selectedCell?.row === row && selectedCell?.column === column}
            onSelect={handleCellSelection}
            onEdit={handleCellEdit}
          />
        ))}
      </div>
    </div>
  );
};
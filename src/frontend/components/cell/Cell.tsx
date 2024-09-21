import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Input } from 'src/frontend/components/common/Input';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { useCellContext, useFormulaBarContext } from 'src/shared/contexts/index';
import { CellProps, CellValue, CellCoordinate } from 'src/shared/types/index';
import { formatCellValue } from 'src/shared/utils/index';

export const Cell: React.FC<CellProps> = ({
  coordinate,
  isSelected,
  onSelect,
  onEdit,
  className,
}) => {
  const { getCellData, updateCellData } = useCellContext();
  const { updateFormulaBar } = useFormulaBarContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const cellRef = useRef<HTMLDivElement>(null);

  const cellData = getCellData(coordinate);

  useEffect(() => {
    if (isSelected && !isEditing) {
      cellRef.current?.focus();
    }
  }, [isSelected, isEditing]);

  const cellClassName = classNames(
    'cell',
    {
      'cell-selected': isSelected,
      'cell-editing': isEditing,
    },
    className
  );

  const handleSelect = () => {
    onSelect(coordinate);
    updateFormulaBar(cellData.formula || cellData.value?.toString() || '');
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(cellData.formula || cellData.value?.toString() || '');
  };

  const handleChange = (value: string) => {
    setEditValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const newValue: CellValue = cellData.formula ? { formula: editValue } : editValue;
    onEdit(coordinate, newValue);
    updateCellData(coordinate, newValue);
  };

  const renderCellContent = () => {
    if (isEditing) {
      return (
        <Input
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      );
    }

    const formattedValue = formatCellValue(cellData.value, cellData.format);
    return (
      <Tooltip content={formattedValue}>
        <div className="cell-content">{formattedValue}</div>
      </Tooltip>
    );
  };

  return (
    <div
      ref={cellRef}
      className={cellClassName}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      style={{
        textAlign: cellData.format?.textAlign,
        backgroundColor: cellData.format?.backgroundColor,
      }}
    >
      {renderCellContent()}
    </div>
  );
};
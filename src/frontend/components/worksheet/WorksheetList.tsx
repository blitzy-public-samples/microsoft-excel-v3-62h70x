import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Modal } from 'src/frontend/components/common/Modal';
import { WorksheetItem } from 'src/frontend/components/worksheet/WorksheetItem';
import { useWorkbookContext, useWorksheetContext } from 'src/shared/contexts/index';
import { Worksheet, WorksheetListProps } from 'src/shared/types/index';

export const WorksheetList: React.FC<WorksheetListProps> = ({ className, onWorksheetSelect }) => {
  const [newWorksheetName, setNewWorksheetName] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { currentWorkbook } = useWorkbookContext();
  const { worksheets, addWorksheet, deleteWorksheet, renameWorksheet, reorderWorksheets } = useWorksheetContext();

  useEffect(() => {
    // Update worksheet list when the workbook changes
  }, [currentWorkbook]);

  const handleAddWorksheet = () => {
    if (newWorksheetName.trim()) {
      addWorksheet(newWorksheetName.trim());
      setNewWorksheetName('');
      setIsAddModalVisible(false);
    }
  };

  const handleDeleteWorksheet = (worksheetId: string) => {
    deleteWorksheet(worksheetId);
  };

  const handleRenameWorksheet = (worksheetId: string, newName: string) => {
    renameWorksheet(worksheetId, newName);
  };

  const handleReorderWorksheets = (startIndex: number, endIndex: number) => {
    reorderWorksheets(startIndex, endIndex);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    handleReorderWorksheets(dragIndex, dropIndex);
  };

  return (
    <div className={classNames('worksheet-list', className)}>
      <Button onClick={() => setIsAddModalVisible(true)}>Add New Worksheet</Button>
      <ul>
        {worksheets.map((worksheet, index) => (
          <li
            key={worksheet.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <WorksheetItem
              worksheet={worksheet}
              onSelect={onWorksheetSelect}
              onRename={(newName) => handleRenameWorksheet(worksheet.id, newName)}
              onDelete={() => handleDeleteWorksheet(worksheet.id)}
            />
          </li>
        ))}
      </ul>
      <Modal
        isOpen={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        title="Add New Worksheet"
      >
        <Input
          value={newWorksheetName}
          onChange={(e) => setNewWorksheetName(e.target.value)}
          placeholder="Enter worksheet name"
        />
        <Button onClick={handleAddWorksheet}>Add Worksheet</Button>
      </Modal>
    </div>
  );
};
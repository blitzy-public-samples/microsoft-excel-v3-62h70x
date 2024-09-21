import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { Modal } from 'src/frontend/components/common/Modal';
import { Input } from 'src/frontend/components/common/Input';
import { Workbook, WorkbookItemProps } from 'src/shared/types/index';

export const WorkbookItem: React.FC<WorkbookItemProps> = ({
  workbook,
  onSelect,
  onRename,
  onDelete,
  className,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(workbook.name);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSelect = () => {
    onSelect(workbook);
  };

  const handleRename = () => {
    if (newName.trim() !== '' && newName !== workbook.name) {
      onRename(workbook, newName);
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    onDelete(workbook);
  };

  const containerClassName = classNames(
    'workbook-item',
    'p-4',
    'border',
    'rounded',
    'hover:bg-gray-100',
    className
  );

  return (
    <div className={containerClassName}>
      <div className="flex items-center mb-2">
        <div className="workbook-icon mr-2">
          {/* TODO: Implement custom icons or thumbnails */}
          📊
        </div>
        {isRenaming ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold">{workbook.name}</h3>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Last modified: {new Date(workbook.updatedAt).toLocaleString()}
      </p>
      <div className="flex justify-end space-x-2">
        <Tooltip content="Open workbook">
          <Button onClick={handleSelect} variant="primary" size="small">
            Open
          </Button>
        </Tooltip>
        <Tooltip content="Rename workbook">
          <Button
            onClick={() => setIsRenaming(true)}
            variant="secondary"
            size="small"
          >
            Rename
          </Button>
        </Tooltip>
        <Tooltip content="Delete workbook">
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            variant="danger"
            size="small"
          >
            Delete
          </Button>
        </Tooltip>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete "{workbook.name}"?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
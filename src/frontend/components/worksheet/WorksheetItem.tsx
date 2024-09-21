import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { Input } from 'src/frontend/components/common/Input';
import { Modal } from 'src/frontend/components/common/Modal';
import { Worksheet, WorksheetItemProps } from 'src/shared/types/index';

export const WorksheetItem: React.FC<WorksheetItemProps> = ({
  worksheet,
  isActive,
  onSelect,
  onRename,
  onDelete,
  className,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(worksheet.name);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSelect = () => {
    onSelect(worksheet);
  };

  const handleRename = () => {
    if (newName.trim() !== '' && newName !== worksheet.name) {
      onRename(worksheet, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    onDelete(worksheet);
  };

  const containerClassName = classNames(
    'worksheet-item',
    {
      'worksheet-item--active': isActive,
    },
    className
  );

  return (
    <div className={containerClassName} onClick={handleSelect}>
      <div className="worksheet-item__icon">
        {/* Add worksheet icon or color indicator here */}
      </div>
      {isRenaming ? (
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyPress={(e) => e.key === 'Enter' && handleRename()}
          autoFocus
        />
      ) : (
        <span className="worksheet-item__name">{worksheet.name}</span>
      )}
      <div className="worksheet-item__actions">
        <Tooltip content="Rename worksheet">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            variant="secondary"
            size="small"
          >
            Rename
          </Button>
        </Tooltip>
        <Tooltip content="Delete worksheet">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            variant="secondary"
            size="small"
          >
            Delete
          </Button>
        </Tooltip>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Worksheet"
      >
        <p>Are you sure you want to delete the worksheet "{worksheet.name}"?</p>
        <div className="modal-actions">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="primary">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
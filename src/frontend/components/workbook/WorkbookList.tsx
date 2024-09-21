import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Modal } from 'src/frontend/components/common/Modal';
import { WorkbookItem } from 'src/frontend/components/workbook/WorkbookItem';
import { useWorkbookContext } from 'src/shared/contexts/index';
import { Workbook, WorkbookListProps } from 'src/shared/types/index';

export const WorkbookList: React.FC<WorkbookListProps> = ({ className, onWorkbookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newWorkbookName, setNewWorkbookName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [workbooksPerPage] = useState(10);

  const { workbooks, fetchWorkbooks, createWorkbook, deleteWorkbook, renameWorkbook } = useWorkbookContext();

  useEffect(() => {
    fetchWorkbooks();
  }, [fetchWorkbooks]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateWorkbook = async () => {
    if (newWorkbookName.trim()) {
      await createWorkbook(newWorkbookName.trim());
      setNewWorkbookName('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteWorkbook = async (workbookId: string) => {
    if (window.confirm('Are you sure you want to delete this workbook?')) {
      await deleteWorkbook(workbookId);
    }
  };

  const handleRenameWorkbook = async (workbookId: string, newName: string) => {
    if (newName.trim()) {
      await renameWorkbook(workbookId, newName.trim());
    }
  };

  const filteredWorkbooks = workbooks.filter(workbook =>
    workbook.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastWorkbook = currentPage * workbooksPerPage;
  const indexOfFirstWorkbook = indexOfLastWorkbook - workbooksPerPage;
  const currentWorkbooks = filteredWorkbooks.slice(indexOfFirstWorkbook, indexOfLastWorkbook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={classNames('workbook-list', className)}>
      <div className="workbook-list__header">
        <Input
          type="text"
          placeholder="Search workbooks..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>Create New Workbook</Button>
      </div>

      <div className="workbook-list__content">
        {currentWorkbooks.map(workbook => (
          <WorkbookItem
            key={workbook.id}
            workbook={workbook}
            onSelect={onWorkbookSelect}
            onDelete={() => handleDeleteWorkbook(workbook.id)}
            onRename={(newName) => handleRenameWorkbook(workbook.id, newName)}
          />
        ))}
      </div>

      {filteredWorkbooks.length > workbooksPerPage && (
        <div className="workbook-list__pagination">
          {Array.from({ length: Math.ceil(filteredWorkbooks.length / workbooksPerPage) }, (_, i) => (
            <Button key={i} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? 'primary' : 'secondary'}>
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workbook"
      >
        <Input
          type="text"
          placeholder="Enter workbook name"
          value={newWorkbookName}
          onChange={(e) => setNewWorkbookName(e.target.value)}
        />
        <Button onClick={handleCreateWorkbook}>Create</Button>
      </Modal>
    </div>
  );
};
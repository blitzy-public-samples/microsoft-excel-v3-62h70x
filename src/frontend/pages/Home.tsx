import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Modal } from 'src/frontend/components/common/Modal';
import { WorkbookList } from 'src/frontend/components/workbook/WorkbookList';
import { useWorkbookContext } from 'src/shared/contexts/index';
import { Workbook } from 'src/shared/types/index';

export const Home: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkbooks, setFilteredWorkbooks] = useState<Workbook[]>([]);
  const [newWorkbookName, setNewWorkbookName] = useState('');

  const { workbooks, templates, createWorkbook, openWorkbook, fetchRecentWorkbooks, fetchTemplates } = useWorkbookContext();

  useEffect(() => {
    fetchRecentWorkbooks();
    fetchTemplates();
  }, [fetchRecentWorkbooks, fetchTemplates]);

  useEffect(() => {
    const filtered = workbooks.filter(workbook =>
      workbook.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkbooks(filtered);
  }, [workbooks, searchQuery]);

  const handleCreateWorkbook = () => {
    createWorkbook(newWorkbookName);
    setIsCreateModalOpen(false);
    setNewWorkbookName('');
  };

  const handleOpenWorkbook = (workbook: Workbook) => {
    openWorkbook(workbook.id);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={classNames('home-container', 'p-4', 'max-w-7xl', 'mx-auto')}>
      <header className="mb-8">
        <img src="/excel-logo.png" alt="Excel Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold">Welcome to Microsoft Excel</h1>
      </header>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search workbooks..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      <div className="flex space-x-4 mb-8">
        <Button onClick={() => setIsCreateModalOpen(true)}>Create New Workbook</Button>
        <Button onClick={() => {/* Implement file picker logic */}}>Open Workbook</Button>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Workbooks</h2>
        <WorkbookList workbooks={filteredWorkbooks} onSelect={handleOpenWorkbook} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template.id} className="template-item p-4 border rounded">
              <h3 className="font-semibold">{template.name}</h3>
              <p>{template.description}</p>
              <Button onClick={() => createWorkbook(template.name, template.id)}>
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </section>

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
          className="mb-4"
        />
        <Button onClick={handleCreateWorkbook}>Create</Button>
      </Modal>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import Header from 'src/frontend/components/layout/Header';
import Sidebar from 'src/frontend/components/layout/Sidebar';
import Footer from 'src/frontend/components/layout/Footer';
import CellGrid from 'src/frontend/components/cell/CellGrid';
import FormulaBar from 'src/frontend/components/formula/FormulaBar';
import WorksheetList from 'src/frontend/components/worksheet/WorksheetList';

import { useWorkbookContext, useWorksheetContext, useSelectionContext, useUndoContext } from 'src/shared/contexts/index';
import { Workbook } from 'src/shared/types/index';

const WorkbookPage: React.FC = () => {
  const { workbookId } = useParams<{ workbookId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getWorkbook, currentWorkbook, setCurrentWorkbook } = useWorkbookContext();
  const { currentWorksheet, setCurrentWorksheet } = useWorksheetContext();
  const { selectedCells } = useSelectionContext();
  const { undo, redo } = useUndoContext();

  useEffect(() => {
    const fetchWorkbook = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const workbook = await getWorkbook(workbookId);
        setCurrentWorkbook(workbook);
        if (workbook.worksheets.length > 0) {
          setCurrentWorksheet(workbook.worksheets[0]);
        }
      } catch (err) {
        setError('Failed to load workbook. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkbook();
  }, [workbookId, getWorkbook, setCurrentWorkbook, setCurrentWorksheet]);

  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            // Implement save functionality
            break;
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [undo, redo]);

  useEffect(() => {
    const handleResize = () => {
      // Implement layout adjustments if necessary
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Implement auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      // Implement auto-save logic
    }, 60000); // Auto-save every minute

    return () => clearInterval(autoSave);
  }, [currentWorkbook]);

  if (isLoading) {
    return <div>Loading workbook...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={classNames('workbook-page')}>
      <Header workbook={currentWorkbook} />
      <div className="workbook-content">
        <Sidebar>
          <WorksheetList workbook={currentWorkbook} />
        </Sidebar>
        <main>
          <FormulaBar />
          <CellGrid worksheet={currentWorksheet} />
        </main>
      </div>
      <Footer workbook={currentWorkbook} selectedCells={selectedCells} />
    </div>
  );
};

export default WorkbookPage;
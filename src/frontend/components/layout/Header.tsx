import React from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Dropdown } from 'src/frontend/components/common/Dropdown';
import { useWorkbookContext, useUndoContext } from 'src/shared/contexts/index';
import { HeaderProps } from 'src/shared/types/index';

export const Header: React.FC<HeaderProps> = ({ className }) => {
  // Use workbook context to get workbook-related functions and state
  const { currentWorkbook, saveWorkbook } = useWorkbookContext();

  // Use undo context to get undo/redo functions
  const { undo, redo, canUndo, canRedo } = useUndoContext();

  // Create a className string using classNames utility
  const headerClassName = classNames('excel-header', className);

  return (
    <header className={headerClassName}>
      {/* Excel logo and application name */}
      <div className="excel-header__logo">
        <img src="/excel-logo.png" alt="Excel Logo" />
        <span>Microsoft Excel</span>
      </div>

      {/* File menu dropdown */}
      <Dropdown
        label="File"
        items={[
          { label: 'New', onClick: () => {} },
          { label: 'Open', onClick: () => {} },
          { label: 'Save', onClick: saveWorkbook },
          { label: 'Save As', onClick: () => {} },
          { label: 'Print', onClick: () => {} },
        ]}
      />

      {/* Quick access toolbar */}
      <div className="excel-header__quick-access">
        <Button onClick={saveWorkbook} disabled={!currentWorkbook}>
          Save
        </Button>
        <Button onClick={undo} disabled={!canUndo}>
          Undo
        </Button>
        <Button onClick={redo} disabled={!canRedo}>
          Redo
        </Button>
      </div>

      {/* Main menu bar */}
      <nav className="excel-header__menu-bar">
        <Dropdown label="Home" items={[]} />
        <Dropdown label="Insert" items={[]} />
        <Dropdown label="Page Layout" items={[]} />
        <Dropdown label="Formulas" items={[]} />
        <Dropdown label="Data" items={[]} />
        <Dropdown label="Review" items={[]} />
        <Dropdown label="View" items={[]} />
      </nav>

      {/* User profile section */}
      <div className="excel-header__user-profile">
        <img src="/user-avatar.png" alt="User Avatar" />
        <span>John Doe</span>
      </div>
    </header>
  );
};
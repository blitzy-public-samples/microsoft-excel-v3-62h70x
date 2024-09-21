import React from 'react';
import classNames from 'classnames';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { useWorkbookContext, useWorksheetContext, useSelectionContext } from 'src/shared/contexts/index';
import { FooterProps } from 'src/shared/types/index';

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const { currentWorkbook, totalCells, usedCells, currentUser, sharingStatus } = useWorkbookContext();
  const { currentWorksheet } = useWorksheetContext();
  const { selectedRange, activeCell } = useSelectionContext();

  const footerClassName = classNames('excel-footer', className);

  return (
    <footer className={footerClassName}>
      <Tooltip content="Current worksheet">
        <div className="worksheet-name">{currentWorksheet?.name}</div>
      </Tooltip>

      <Tooltip content="Selected range">
        <div className="cell-selection">{selectedRange || activeCell}</div>
      </Tooltip>

      <Tooltip content="Active cell formula">
        <div className="cell-formula">{activeCell?.formula}</div>
      </Tooltip>

      <div className="quick-actions">
        <Tooltip content="Zoom">
          <button className="zoom-button">100%</button>
        </Tooltip>
        <Tooltip content="Add new sheet">
          <button className="new-sheet-button">+</button>
        </Tooltip>
      </div>

      <Tooltip content="Workbook statistics">
        <div className="workbook-stats">
          <span>Total cells: {totalCells}</span>
          <span>Used cells: {usedCells}</span>
        </div>
      </Tooltip>

      <Tooltip content="User and sharing information">
        <div className="user-info">
          <span>{currentUser?.name}</span>
          <span>{sharingStatus}</span>
        </div>
      </Tooltip>
    </footer>
  );
};
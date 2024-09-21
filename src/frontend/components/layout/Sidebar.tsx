import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { useWorksheetContext } from 'src/shared/contexts/index';
import { SidebarProps } from 'src/shared/types/index';

export const Sidebar: React.FC<SidebarProps> = ({ className = '', initialCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { currentWorksheet, worksheets, selectWorksheet } = useWorksheetContext();

  const sidebarClasses = classNames(
    'sidebar',
    {
      'sidebar--collapsed': isCollapsed,
    },
    className
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={sidebarClasses}>
      <Button
        onClick={toggleSidebar}
        className="sidebar__toggle-btn"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '>' : '<'}
      </Button>

      <div className="sidebar__content">
        {/* Worksheet navigation and management */}
        <section className="sidebar__section">
          <h3>{isCollapsed ? 'WS' : 'Worksheets'}</h3>
          <ul>
            {worksheets.map((worksheet) => (
              <li key={worksheet.id}>
                <Button
                  onClick={() => selectWorksheet(worksheet.id)}
                  className={classNames('sidebar__worksheet-btn', {
                    'sidebar__worksheet-btn--active': worksheet.id === currentWorksheet?.id,
                  })}
                >
                  {isCollapsed ? worksheet.name.charAt(0) : worksheet.name}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        {/* Data analysis tools */}
        <section className="sidebar__section">
          <h3>{isCollapsed ? 'DA' : 'Data Analysis'}</h3>
          <Tooltip content="Sort data">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'S' : 'Sort'}
            </Button>
          </Tooltip>
          <Tooltip content="Filter data">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'F' : 'Filter'}
            </Button>
          </Tooltip>
          <Tooltip content="Create pivot table">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'P' : 'Pivot Table'}
            </Button>
          </Tooltip>
        </section>

        {/* Charting and visualization options */}
        <section className="sidebar__section">
          <h3>{isCollapsed ? 'CH' : 'Charts'}</h3>
          <Tooltip content="Create bar chart">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'B' : 'Bar Chart'}
            </Button>
          </Tooltip>
          <Tooltip content="Create line chart">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'L' : 'Line Chart'}
            </Button>
          </Tooltip>
          <Tooltip content="Create pie chart">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'P' : 'Pie Chart'}
            </Button>
          </Tooltip>
        </section>

        {/* Formula and function library */}
        <section className="sidebar__section">
          <h3>{isCollapsed ? 'FN' : 'Functions'}</h3>
          <Tooltip content="Sum function">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'Σ' : 'SUM'}
            </Button>
          </Tooltip>
          <Tooltip content="Average function">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'A' : 'AVERAGE'}
            </Button>
          </Tooltip>
          <Tooltip content="Count function">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'C' : 'COUNT'}
            </Button>
          </Tooltip>
        </section>

        {/* Cell formatting and styles */}
        <section className="sidebar__section">
          <h3>{isCollapsed ? 'FM' : 'Formatting'}</h3>
          <Tooltip content="Bold text">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'B' : 'Bold'}
            </Button>
          </Tooltip>
          <Tooltip content="Italic text">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'I' : 'Italic'}
            </Button>
          </Tooltip>
          <Tooltip content="Underline text">
            <Button className="sidebar__tool-btn">
              {isCollapsed ? 'U' : 'Underline'}
            </Button>
          </Tooltip>
        </section>
      </div>
    </div>
  );
};
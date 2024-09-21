import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Tooltip } from 'src/frontend/components/common/Tooltip';
import { Modal } from 'src/frontend/components/common/Modal';
import { Chart, ChartType, ChartItemProps } from 'src/shared/types/index';

export const ChartItem: React.FC<ChartItemProps> = ({
  chart,
  onSelect,
  onEdit,
  onDelete,
  className,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const containerClassName = classNames(
    'chart-item',
    {
      [`chart-item--${chart.type.toLowerCase()}`]: true,
    },
    className
  );

  const handleSelect = () => {
    onSelect(chart);
  };

  const handleEdit = () => {
    onEdit(chart);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(chart);
    setIsDeleteModalOpen(false);
  };

  const renderChartIcon = () => {
    // TODO: Implement chart icon or thumbnail based on chart type
    return <div className="chart-item__icon">{chart.type}</div>;
  };

  return (
    <div className={containerClassName} onClick={handleSelect}>
      {renderChartIcon()}
      <div className="chart-item__info">
        <h3 className="chart-item__name">{chart.name}</h3>
        <p className="chart-item__type">{ChartType[chart.type]}</p>
      </div>
      <div className="chart-item__actions">
        <Tooltip content="Edit Chart">
          <Button onClick={handleEdit} variant="secondary" size="small">
            Edit
          </Button>
        </Tooltip>
        <Tooltip content="Delete Chart">
          <Button onClick={handleDelete} variant="danger" size="small">
            Delete
          </Button>
        </Tooltip>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete the chart "{chart.name}"?</p>
        <div className="modal__actions">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
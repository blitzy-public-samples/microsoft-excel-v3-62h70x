import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Modal } from 'src/frontend/components/common/Modal';
import { ChartItem } from 'src/frontend/components/chart/ChartItem';
import { useWorksheetContext } from 'src/shared/contexts/index';
import { Chart, ChartType, ChartListProps } from 'src/shared/types/index';

export const ChartList: React.FC<ChartListProps> = ({ className, onChartSelect }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [dataRange, setDataRange] = useState('');
  const { charts, createChart, editChart, deleteChart } = useWorksheetContext();

  useEffect(() => {
    // Fetch the list of charts when the component mounts
    // This is assuming that the useWorksheetContext hook provides a way to fetch charts
    // If not, you might need to implement a separate fetch function here
  }, []);

  const handleCreateChart = () => {
    if (selectedChartType && dataRange) {
      createChart(selectedChartType, dataRange);
      setIsCreateModalOpen(false);
      setSelectedChartType(null);
      setDataRange('');
    }
  };

  const handleEditChart = (chart: Chart) => {
    // Implement edit functionality
    editChart(chart.id, { ...chart });
  };

  const handleDeleteChart = (chartId: string) => {
    deleteChart(chartId);
  };

  const containerClassName = classNames('chart-list', className);

  return (
    <div className={containerClassName}>
      <Button onClick={() => setIsCreateModalOpen(true)}>Create New Chart</Button>
      
      {charts.map((chart) => (
        <ChartItem
          key={chart.id}
          chart={chart}
          onSelect={onChartSelect}
          onEdit={handleEditChart}
          onDelete={handleDeleteChart}
        />
      ))}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Chart"
      >
        <select
          value={selectedChartType || ''}
          onChange={(e) => setSelectedChartType(e.target.value as ChartType)}
        >
          <option value="">Select Chart Type</option>
          {Object.values(ChartType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={dataRange}
          onChange={(e) => setDataRange(e.target.value)}
          placeholder="Enter data range (e.g., A1:B10)"
        />
        <Button onClick={handleCreateChart} disabled={!selectedChartType || !dataRange}>
          Create Chart
        </Button>
      </Modal>
    </div>
  );
};
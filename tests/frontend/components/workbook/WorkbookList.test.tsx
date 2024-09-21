import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { WorkbookList } from 'src/frontend/components/workbook/WorkbookList';
import { WorkbookContext } from 'src/shared/contexts/index';
import { Workbook } from 'src/shared/types/index';

// Mock data
const mockWorkbooks: Workbook[] = [
  { id: '1', name: 'Workbook 1', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Workbook 2', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Workbook 3', createdAt: new Date(), updatedAt: new Date() },
];

const mockWorkbookContext = {
  workbooks: mockWorkbooks,
  createWorkbook: jest.fn(),
  deleteWorkbook: jest.fn(),
};

describe('WorkbookList component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workbook list correctly', () => {
    const { getByText, getByRole } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList />
      </WorkbookContext.Provider>
    );

    mockWorkbooks.forEach((workbook) => {
      expect(getByText(workbook.name)).toBeInTheDocument();
    });

    expect(getByRole('button', { name: 'Create New Workbook' })).toBeInTheDocument();
  });

  it('handles workbook selection', () => {
    const mockOnWorkbookSelect = jest.fn();
    const { getByText } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList onWorkbookSelect={mockOnWorkbookSelect} />
      </WorkbookContext.Provider>
    );

    fireEvent.click(getByText('Workbook 1'));

    expect(mockOnWorkbookSelect).toHaveBeenCalledWith(mockWorkbooks[0]);
  });

  it('opens create workbook modal', () => {
    const { getByRole, getByText } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList />
      </WorkbookContext.Provider>
    );

    fireEvent.click(getByRole('button', { name: 'Create New Workbook' }));

    expect(getByText('Create New Workbook')).toBeInTheDocument();
  });

  it('creates a new workbook', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList />
      </WorkbookContext.Provider>
    );

    fireEvent.click(getByRole('button', { name: 'Create New Workbook' }));
    fireEvent.change(getByLabelText('Workbook Name'), { target: { value: 'New Workbook' } });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Create' }));
    });

    expect(mockWorkbookContext.createWorkbook).toHaveBeenCalledWith('New Workbook');
    expect(getByText('Create New Workbook')).not.toBeVisible();
  });

  it('filters workbooks based on search query', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList />
      </WorkbookContext.Provider>
    );

    const searchInput = getByPlaceholderText('Search workbooks');
    fireEvent.change(searchInput, { target: { value: 'Workbook 1' } });

    expect(getByText('Workbook 1')).toBeInTheDocument();
    expect(queryByText('Workbook 2')).not.toBeInTheDocument();
    expect(queryByText('Workbook 3')).not.toBeInTheDocument();
  });

  it('handles workbook deletion', async () => {
    const { getByText, getAllByRole, queryByText } = render(
      <WorkbookContext.Provider value={mockWorkbookContext}>
        <WorkbookList />
      </WorkbookContext.Provider>
    );

    const deleteButtons = getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    expect(getByText('Are you sure you want to delete this workbook?')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByText('Confirm'));
    });

    expect(mockWorkbookContext.deleteWorkbook).toHaveBeenCalledWith('1');
    expect(queryByText('Workbook 1')).not.toBeInTheDocument();
  });
});

// Human tasks:
// TODO: Implement tests for error handling scenarios (e.g., network errors during workbook creation or deletion)
// TODO: Add tests for pagination or infinite scrolling if implemented in the WorkbookList component
// TODO: Implement tests for sorting functionality if available in the WorkbookList
// TODO: Add tests for accessibility features (e.g., keyboard navigation, screen reader compatibility)
// TODO: Implement tests for different view modes (e.g., list view vs. grid view) if applicable
// TODO: Add performance tests to ensure the WorkbookList renders efficiently with a large number of workbooks
// TODO: Implement tests for any workbook sharing or collaboration features
import { Worksheet } from 'src/backend/models/Worksheet';
import { Cell } from 'src/backend/models/Cell';
import { Chart } from 'src/backend/models/Chart';
import { Workbook } from 'src/backend/models/Workbook';
import { WorksheetDocument, CellDocument, ChartDocument, CellCoordinate, CellValue, ChartType, CellRange } from 'src/shared/types/index';

export class WorksheetService {
  constructor() {}

  async getWorksheet(worksheetId: string): Promise<WorksheetDocument> {
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    return worksheet;
  }

  async updateWorksheet(worksheetId: string, updateData: object): Promise<WorksheetDocument> {
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    Object.assign(worksheet, updateData);
    await worksheet.save();
    return worksheet;
  }

  async deleteWorksheet(worksheetId: string): Promise<void> {
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    await Cell.deleteMany({ worksheet: worksheetId });
    await Chart.deleteMany({ worksheet: worksheetId });
    await Workbook.updateOne(
      { worksheets: worksheetId },
      { $pull: { worksheets: worksheetId } }
    );
    await worksheet.remove();
  }

  async getCellValue(worksheetId: string, coordinate: CellCoordinate): Promise<CellValue> {
    const cell = await Cell.findOne({ worksheet: worksheetId, coordinate });
    return cell ? cell.value : null;
  }

  async setCellValue(worksheetId: string, coordinate: CellCoordinate, value: CellValue): Promise<CellDocument> {
    let cell = await Cell.findOne({ worksheet: worksheetId, coordinate });
    if (!cell) {
      cell = new Cell({ worksheet: worksheetId, coordinate, value });
    } else {
      cell.value = value;
    }
    await cell.save();
    return cell;
  }

  async addChart(worksheetId: string, name: string, type: ChartType, dataRange: CellRange, options: object): Promise<ChartDocument> {
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    const chart = new Chart({ worksheet: worksheetId, name, type, dataRange, options });
    await chart.save();
    worksheet.charts.push(chart._id);
    await worksheet.save();
    return chart;
  }

  async removeChart(worksheetId: string, chartId: string): Promise<WorksheetDocument> {
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    worksheet.charts = worksheet.charts.filter(id => id.toString() !== chartId);
    await Chart.findByIdAndDelete(chartId);
    await worksheet.save();
    return worksheet;
  }
}

// TODO: Implement methods for bulk cell operations (e.g., inserting/deleting rows or columns)
// TODO: Add support for worksheet-level formatting and styles
// TODO: Implement data validation rules for cells
// TODO: Add functionality for cell merging and splitting
// TODO: Implement worksheet protection features (e.g., locking cells or ranges)
// TODO: Add support for conditional formatting rules
// TODO: Implement methods for importing/exporting worksheet data in various formats (CSV, JSON, etc.)
import { Chart } from 'src/backend/models/Chart';
import { Worksheet } from 'src/backend/models/Worksheet';
import { ChartDocument, ChartType, CellRange } from 'src/shared/types/index';
import { CellService } from 'src/backend/services/CellService';

export class ChartService {
  constructor(private cellService: CellService) {}

  async createChart(
    worksheetId: string,
    name: string,
    type: ChartType,
    dataRange: CellRange,
    options: object
  ): Promise<ChartDocument> {
    // Validate the input parameters
    if (!worksheetId || !name || !type || !dataRange) {
      throw new Error('Invalid input parameters');
    }

    // Find the worksheet by ID
    const worksheet = await Worksheet.findById(worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    // Create a new Chart document with the provided data
    const chart = new Chart({
      name,
      type,
      dataRange,
      options,
      worksheet: worksheetId,
    });

    // Add the new chart to the worksheet's charts array
    worksheet.charts.push(chart._id);

    // Save the worksheet document
    await worksheet.save();

    // Save and return the newly created chart document
    return await chart.save();
  }

  async getChart(chartId: string): Promise<ChartDocument> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    return chart;
  }

  async updateChart(chartId: string, updateData: object): Promise<ChartDocument> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Update the chart properties with the provided updateData
    Object.assign(chart, updateData);

    // Save the updated chart document
    return await chart.save();
  }

  async deleteChart(chartId: string): Promise<void> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Find the associated worksheet
    const worksheet = await Worksheet.findById(chart.worksheet);
    if (!worksheet) {
      throw new Error('Associated worksheet not found');
    }

    // Remove the chart from the worksheet's charts array
    worksheet.charts = worksheet.charts.filter(id => id.toString() !== chartId);

    // Delete the Chart document
    await Chart.findByIdAndDelete(chartId);

    // Save the updated worksheet document
    await worksheet.save();
  }

  async updateChartData(chartId: string, newDataRange: CellRange): Promise<ChartDocument> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Validate the new data range
    if (!this.isValidCellRange(newDataRange)) {
      throw new Error('Invalid cell range');
    }

    // Update the chart's dataRange property
    chart.dataRange = newDataRange;

    // Fetch the new cell data using cellService
    const cellData = await this.cellService.getCellsInRange(chart.worksheet.toString(), newDataRange);

    // Update the chart's internal data representation
    chart.data = this.processChartData(cellData, chart.type);

    // Save the updated chart document
    return await chart.save();
  }

  async getChartData(chartId: string): Promise<object> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Fetch the cell data for the chart's data range using cellService
    const cellData = await this.cellService.getCellsInRange(chart.worksheet.toString(), chart.dataRange);

    // Process the cell data into a format suitable for the chart type
    return this.processChartData(cellData, chart.type);
  }

  private isValidCellRange(range: CellRange): boolean {
    // Implement validation logic for cell range
    // This is a placeholder and should be implemented based on your specific requirements
    return true;
  }

  private processChartData(cellData: any[], chartType: ChartType): object {
    // Implement data processing logic based on chart type
    // This is a placeholder and should be implemented based on your specific requirements
    return {
      labels: cellData.map(cell => cell.value),
      datasets: [
        {
          data: cellData.map(cell => cell.value),
        },
      ],
    };
  }
}
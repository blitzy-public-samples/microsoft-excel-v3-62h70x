import { Request, Response, NextFunction } from 'express';
import { ChartService } from 'src/backend/services/ChartService';
import { WorksheetService } from 'src/backend/services/WorksheetService';
import { ChartDocument, ChartType, CellRange } from 'src/shared/types/index';

export class ChartController {
    private chartService: ChartService;
    private worksheetService: WorksheetService;

    constructor(chartService: ChartService, worksheetService: WorksheetService) {
        this.chartService = chartService;
        this.worksheetService = worksheetService;
    }

    public async createChart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId, name, type, dataRange, options } = req.body;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            const chart = await this.chartService.createChart(worksheetId, { name, type, dataRange, options });
            res.status(201).json(chart);
        } catch (error) {
            next(error);
        }
    }

    public async getChart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chartId = req.params.chartId;
            const chart = await this.chartService.getChart(chartId);

            if (!chart) {
                res.status(404).json({ message: 'Chart not found' });
                return;
            }

            res.status(200).json(chart);
        } catch (error) {
            next(error);
        }
    }

    public async updateChart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chartId = req.params.chartId;
            const updateData = req.body;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the chart

            const updatedChart = await this.chartService.updateChart(chartId, updateData);

            if (!updatedChart) {
                res.status(404).json({ message: 'Chart not found' });
                return;
            }

            res.status(200).json(updatedChart);
        } catch (error) {
            next(error);
        }
    }

    public async deleteChart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chartId = req.params.chartId;
            // TODO: Check user permission to modify the worksheet

            const result = await this.chartService.deleteChart(chartId);

            if (!result) {
                res.status(404).json({ message: 'Chart not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public async getChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chartId = req.params.chartId;
            const chartData = await this.chartService.getChartData(chartId);

            if (!chartData) {
                res.status(404).json({ message: 'Chart not found' });
                return;
            }

            res.status(200).json(chartData);
        } catch (error) {
            next(error);
        }
    }

    public async updateChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chartId = req.params.chartId;
            const newDataRange: CellRange = req.body.dataRange;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the chart

            const updatedChart = await this.chartService.updateChartData(chartId, newDataRange);

            if (!updatedChart) {
                res.status(404).json({ message: 'Chart not found' });
                return;
            }

            res.status(200).json(updatedChart);
        } catch (error) {
            next(error);
        }
    }
}
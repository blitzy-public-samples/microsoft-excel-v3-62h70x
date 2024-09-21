import { Request, Response, NextFunction } from 'express';
import { WorksheetService } from 'src/backend/services/WorksheetService';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { WorksheetDocument, UserDocument } from 'src/shared/types/index';

export class WorksheetController {
    private worksheetService: WorksheetService;
    private workbookService: WorkbookService;

    constructor(worksheetService: WorksheetService, workbookService: WorkbookService) {
        this.worksheetService = worksheetService;
        this.workbookService = workbookService;
    }

    public async createWorksheet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { workbookId, name } = req.body;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the workbook

            const worksheet = await this.workbookService.addWorksheet(workbookId, name);
            res.status(201).json(worksheet);
        } catch (error) {
            next(error);
        }
    }

    public async getWorksheet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId } = req.params;
            const worksheet = await this.worksheetService.getWorksheet(worksheetId);

            if (!worksheet) {
                res.status(404).json({ message: 'Worksheet not found' });
                return;
            }

            res.status(200).json(worksheet);
        } catch (error) {
            next(error);
        }
    }

    public async updateWorksheet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId } = req.params;
            const updateData = req.body;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            const updatedWorksheet = await this.worksheetService.updateWorksheet(worksheetId, updateData);

            if (!updatedWorksheet) {
                res.status(404).json({ message: 'Worksheet not found' });
                return;
            }

            res.status(200).json(updatedWorksheet);
        } catch (error) {
            next(error);
        }
    }

    public async deleteWorksheet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId } = req.params;
            // TODO: Check user permission to modify the workbook

            await this.workbookService.removeWorksheet(worksheetId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public async getWorksheetCells(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId } = req.params;
            const range = req.query.range as string | undefined;

            const cells = await this.worksheetService.getWorksheetCells(worksheetId, range);

            if (!cells) {
                res.status(404).json({ message: 'Worksheet not found' });
                return;
            }

            res.status(200).json(cells);
        } catch (error) {
            next(error);
        }
    }

    public async updateWorksheetCells(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { worksheetId } = req.params;
            const cellUpdates = req.body;
            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            const updatedCells = await this.worksheetService.updateWorksheetCells(worksheetId, cellUpdates);

            if (!updatedCells) {
                res.status(404).json({ message: 'Worksheet not found' });
                return;
            }

            res.status(200).json(updatedCells);
        } catch (error) {
            next(error);
        }
    }
}

// TODO: Implement input validation logic for all controller methods
// TODO: Add support for bulk cell updates in updateWorksheetCells method
// TODO: Implement pagination for getWorksheetCells method when dealing with large datasets
// TODO: Add support for filtering and sorting options in getWorksheetCells method
// TODO: Implement worksheet copy functionality
// TODO: Add support for importing/exporting worksheet data in various formats (CSV, JSON, etc.)
// TODO: Implement worksheet protection features (e.g., locking cells or ranges)
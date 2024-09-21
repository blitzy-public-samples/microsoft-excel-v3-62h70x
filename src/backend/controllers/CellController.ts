import { Request, Response, NextFunction } from 'express';
import { CellService } from 'src/backend/services/CellService';
import { WorksheetService } from 'src/backend/services/WorksheetService';
import { CellDocument, CellCoordinate, CellValue } from 'src/shared/types/index';

export class CellController {
    private cellService: CellService;
    private worksheetService: WorksheetService;

    constructor(cellService: CellService, worksheetService: WorksheetService) {
        this.cellService = cellService;
        this.worksheetService = worksheetService;
    }

    public async getCell(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const worksheetId = req.params.worksheetId;
            const cellCoordinate: CellCoordinate = {
                row: parseInt(req.params.row),
                column: parseInt(req.params.column)
            };

            // TODO: Implement input validation

            const cell = await this.cellService.getCell(worksheetId, cellCoordinate);

            if (cell) {
                res.status(200).json(cell);
            } else {
                res.status(404).json({ message: 'Cell not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    public async updateCell(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const worksheetId = req.params.worksheetId;
            const cellCoordinate: CellCoordinate = {
                row: parseInt(req.params.row),
                column: parseInt(req.params.column)
            };
            const { value, formula, format } = req.body;

            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            const updatedCell = await this.cellService.createOrUpdateCell(worksheetId, cellCoordinate, { value, formula, format });

            res.status(200).json(updatedCell);
        } catch (error) {
            next(error);
        }
    }

    public async deleteCell(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const worksheetId = req.params.worksheetId;
            const cellCoordinate: CellCoordinate = {
                row: parseInt(req.params.row),
                column: parseInt(req.params.column)
            };

            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            await this.cellService.deleteCell(worksheetId, cellCoordinate);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public async getCellsInRange(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const worksheetId = req.params.worksheetId;
            const startCoordinate: CellCoordinate = {
                row: parseInt(req.query.startRow as string),
                column: parseInt(req.query.startColumn as string)
            };
            const endCoordinate: CellCoordinate = {
                row: parseInt(req.query.endRow as string),
                column: parseInt(req.query.endColumn as string)
            };

            // TODO: Implement input validation

            const cells = await this.cellService.getCellsInRange(worksheetId, startCoordinate, endCoordinate);

            res.status(200).json(cells);
        } catch (error) {
            next(error);
        }
    }

    public async updateCellFormat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const worksheetId = req.params.worksheetId;
            const cellCoordinate: CellCoordinate = {
                row: parseInt(req.params.row),
                column: parseInt(req.params.column)
            };
            const formatData = req.body;

            // TODO: Implement input validation
            // TODO: Check user permission to modify the worksheet

            const updatedCell = await this.cellService.updateCellFormat(worksheetId, cellCoordinate, formatData);

            if (updatedCell) {
                res.status(200).json(updatedCell);
            } else {
                res.status(404).json({ message: 'Cell not found' });
            }
        } catch (error) {
            next(error);
        }
    }
}
import { Request, Response, NextFunction } from 'express';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { WorkbookDocument, UserDocument } from 'src/shared/types/index';

export class WorkbookController {
  constructor(private workbookService: WorkbookService) {}

  public async createWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
      const user = req.user as UserDocument; // Assuming auth middleware adds user to request

      // TODO: Implement input validation

      const workbook = await this.workbookService.createWorkbook(name, user);
      res.status(201).json(workbook);
    } catch (error) {
      next(error);
    }
  }

  public async getWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workbookId } = req.params;
      const workbook = await this.workbookService.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ message: 'Workbook not found' });
        return;
      }

      res.status(200).json(workbook);
    } catch (error) {
      next(error);
    }
  }

  public async updateWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workbookId } = req.params;
      const updateData = req.body;

      // TODO: Implement input validation

      const updatedWorkbook = await this.workbookService.updateWorkbook(workbookId, updateData);

      if (!updatedWorkbook) {
        res.status(404).json({ message: 'Workbook not found' });
        return;
      }

      res.status(200).json(updatedWorkbook);
    } catch (error) {
      next(error);
    }
  }

  public async deleteWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workbookId } = req.params;
      await this.workbookService.deleteWorkbook(workbookId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async shareWorkbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workbookId } = req.params;
      const { userId, permission } = req.body;

      // TODO: Implement input validation

      const sharedWorkbook = await this.workbookService.shareWorkbook(workbookId, userId, permission);

      if (!sharedWorkbook) {
        res.status(404).json({ message: 'Workbook or user not found' });
        return;
      }

      res.status(200).json(sharedWorkbook);
    } catch (error) {
      next(error);
    }
  }

  public async getUserWorkbooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as UserDocument; // Assuming auth middleware adds user to request
      const workbooks = await this.workbookService.getUserWorkbooks(user.id);
      res.status(200).json(workbooks);
    } catch (error) {
      next(error);
    }
  }
}
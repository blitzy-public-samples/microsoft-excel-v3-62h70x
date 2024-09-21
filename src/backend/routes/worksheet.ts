import { Router } from 'express';
import { WorksheetController } from 'src/backend/controllers/WorksheetController';
import { authMiddleware } from 'src/backend/middleware/auth';
import { validateWorksheetCreation, validateWorksheetUpdate, validateCellUpdate } from 'src/backend/middleware/validation';

function createWorksheetRouter(worksheetController: WorksheetController): Router {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Define routes
  router.post('/', validateWorksheetCreation, worksheetController.createWorksheet);
  router.get('/:worksheetId', worksheetController.getWorksheet);
  router.put('/:worksheetId', validateWorksheetUpdate, worksheetController.updateWorksheet);
  router.delete('/:worksheetId', worksheetController.deleteWorksheet);
  router.get('/:worksheetId/cells', worksheetController.getWorksheetCells);
  router.put('/:worksheetId/cells', validateCellUpdate, worksheetController.updateWorksheetCells);

  return router;
}

export default createWorksheetRouter;

// TODO: Implement caching middleware for frequently accessed worksheets
// TODO: Add pagination support for getWorksheetCells route
// TODO: Implement sorting and filtering options for getWorksheetCells route
// TODO: Add support for bulk cell updates in updateWorksheetCells route
// TODO: Implement worksheet copy functionality
// TODO: Add support for importing/exporting worksheet data in various formats (CSV, JSON, etc.)
// TODO: Implement worksheet protection features (e.g., locking cells or ranges)
import { Router } from 'express';
import { WorkbookController } from 'src/backend/controllers/WorkbookController';
import { authMiddleware } from 'src/backend/middleware/auth';
import { validateWorkbookCreation, validateWorkbookUpdate, validateWorkbookShare } from 'src/backend/middleware/validation';

function createWorkbookRouter(workbookController: WorkbookController): Router {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // POST / - Create a new workbook
  router.post('/', validateWorkbookCreation, workbookController.createWorkbook);

  // GET / - Get all workbooks for the authenticated user
  router.get('/', workbookController.getUserWorkbooks);

  // GET /:workbookId - Get a specific workbook
  router.get('/:workbookId', workbookController.getWorkbook);

  // PUT /:workbookId - Update a specific workbook
  router.put('/:workbookId', validateWorkbookUpdate, workbookController.updateWorkbook);

  // DELETE /:workbookId - Delete a specific workbook
  router.delete('/:workbookId', workbookController.deleteWorkbook);

  // POST /:workbookId/share - Share a workbook with another user
  router.post('/:workbookId/share', validateWorkbookShare, workbookController.shareWorkbook);

  return router;
}

export default createWorkbookRouter;
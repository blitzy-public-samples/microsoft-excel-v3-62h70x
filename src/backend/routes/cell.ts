import { Router } from 'express';
import { CellController } from 'src/backend/controllers/CellController';
import { authMiddleware } from 'src/backend/middleware/auth';
import { validateCellUpdate, validateCellFormat } from 'src/backend/middleware/validation';

function createCellRouter(cellController: CellController): Router {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Define routes
  router.get('/:worksheetId/:cellId', cellController.getCell);
  router.put('/:worksheetId/:cellId', validateCellUpdate, cellController.updateCell);
  router.delete('/:worksheetId/:cellId', cellController.deleteCell);
  router.get('/:worksheetId/range', cellController.getCellsInRange);
  router.put('/:worksheetId/:cellId/format', validateCellFormat, cellController.updateCellFormat);

  return router;
}

export default createCellRouter;
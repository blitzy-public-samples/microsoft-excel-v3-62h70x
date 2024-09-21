import { Router } from 'express';
import { ChartController } from 'src/backend/controllers/ChartController';
import { authMiddleware } from 'src/backend/middleware/auth';
import { validateChartCreation, validateChartUpdate, validateChartDataUpdate } from 'src/backend/middleware/validation';

function createChartRouter(chartController: ChartController): Router {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Create a new chart
  router.post('/', validateChartCreation, chartController.createChart);

  // Get a specific chart
  router.get('/:chartId', chartController.getChart);

  // Update a chart
  router.put('/:chartId', validateChartUpdate, chartController.updateChart);

  // Delete a chart
  router.delete('/:chartId', chartController.deleteChart);

  // Get chart data
  router.get('/:chartId/data', chartController.getChartData);

  // Update chart data
  router.put('/:chartId/data', validateChartDataUpdate, chartController.updateChartData);

  return router;
}

export default createChartRouter;
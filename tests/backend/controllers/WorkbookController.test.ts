import { WorkbookController } from 'src/backend/controllers/WorkbookController';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { Request, Response, NextFunction } from 'express';
import { Workbook } from 'src/shared/types/index';
import { mockRequest, mockResponse } from 'jest-mock-express';

describe('WorkbookController', () => {
  let workbookController: WorkbookController;
  let mockWorkbookService: jest.Mocked<WorkbookService>;
  let req: jest.Mocked<Request>;
  let res: jest.Mocked<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockWorkbookService = {
      createWorkbook: jest.fn(),
      getWorkbook: jest.fn(),
      updateWorkbook: jest.fn(),
      deleteWorkbook: jest.fn(),
      shareWorkbook: jest.fn(),
      getUserWorkbooks: jest.fn(),
    } as jest.Mocked<WorkbookService>;

    workbookController = new WorkbookController(mockWorkbookService);
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createWorkbook creates a new workbook', async () => {
    const newWorkbook: Workbook = { id: '1', name: 'New Workbook', ownerId: 'user1' };
    mockWorkbookService.createWorkbook.mockResolvedValue(newWorkbook);
    req.body = { name: 'New Workbook' };
    req.user = { id: 'user1' };

    await workbookController.createWorkbook(req, res, next);

    expect(mockWorkbookService.createWorkbook).toHaveBeenCalledWith('New Workbook', 'user1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newWorkbook);
  });

  it('getWorkbook retrieves a workbook', async () => {
    const workbook: Workbook = { id: '1', name: 'Test Workbook', ownerId: 'user1' };
    mockWorkbookService.getWorkbook.mockResolvedValue(workbook);
    req.params = { workbookId: '1' };

    await workbookController.getWorkbook(req, res, next);

    expect(mockWorkbookService.getWorkbook).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(workbook);
  });

  it('updateWorkbook updates a workbook', async () => {
    const updatedWorkbook: Workbook = { id: '1', name: 'Updated Workbook', ownerId: 'user1' };
    mockWorkbookService.updateWorkbook.mockResolvedValue(updatedWorkbook);
    req.params = { workbookId: '1' };
    req.body = { name: 'Updated Workbook' };

    await workbookController.updateWorkbook(req, res, next);

    expect(mockWorkbookService.updateWorkbook).toHaveBeenCalledWith('1', { name: 'Updated Workbook' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedWorkbook);
  });

  it('deleteWorkbook deletes a workbook', async () => {
    mockWorkbookService.deleteWorkbook.mockResolvedValue(undefined);
    req.params = { workbookId: '1' };

    await workbookController.deleteWorkbook(req, res, next);

    expect(mockWorkbookService.deleteWorkbook).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('shareWorkbook shares a workbook', async () => {
    const sharedWorkbook: Workbook = { id: '1', name: 'Shared Workbook', ownerId: 'user1', sharedWith: ['user2'] };
    mockWorkbookService.shareWorkbook.mockResolvedValue(sharedWorkbook);
    req.params = { workbookId: '1' };
    req.body = { userId: 'user2', permission: 'read' };

    await workbookController.shareWorkbook(req, res, next);

    expect(mockWorkbookService.shareWorkbook).toHaveBeenCalledWith('1', 'user2', 'read');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sharedWorkbook);
  });

  it('getUserWorkbooks retrieves user\'s workbooks', async () => {
    const workbooks: Workbook[] = [
      { id: '1', name: 'Workbook 1', ownerId: 'user1' },
      { id: '2', name: 'Workbook 2', ownerId: 'user1' }
    ];
    mockWorkbookService.getUserWorkbooks.mockResolvedValue(workbooks);
    req.user = { id: 'user1' };

    await workbookController.getUserWorkbooks(req, res, next);

    expect(mockWorkbookService.getUserWorkbooks).toHaveBeenCalledWith('user1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(workbooks);
  });
});
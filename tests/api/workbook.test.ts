import supertest from 'supertest';
import app from 'src/app';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { Workbook } from 'src/shared/types/index';
import { generateAuthToken } from 'tests/helpers/auth';

jest.mock('src/backend/services/WorkbookService');

describe('Workbook API', () => {
  let authToken: string;

  beforeEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
    authToken = await generateAuthToken();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /workbooks creates a new workbook', async () => {
    const workbookData = { name: 'Test Workbook' };
    const createdWorkbook: Workbook = { id: '1', ...workbookData, ownerId: 'user1' };

    (WorkbookService.createWorkbook as jest.Mock).mockResolvedValue(createdWorkbook);

    const response = await supertest(app)
      .post('/workbooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(workbookData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdWorkbook);
    expect(WorkbookService.createWorkbook).toHaveBeenCalledWith(workbookData, expect.any(String));
  });

  it('GET /workbooks/:id retrieves a workbook', async () => {
    const testWorkbook: Workbook = { id: '1', name: 'Test Workbook', ownerId: 'user1' };

    (WorkbookService.getWorkbook as jest.Mock).mockResolvedValue(testWorkbook);

    const response = await supertest(app)
      .get(`/workbooks/${testWorkbook.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testWorkbook);
  });

  it('PUT /workbooks/:id updates a workbook', async () => {
    const testWorkbook: Workbook = { id: '1', name: 'Test Workbook', ownerId: 'user1' };
    const updatedData = { name: 'Updated Workbook' };
    const updatedWorkbook = { ...testWorkbook, ...updatedData };

    (WorkbookService.updateWorkbook as jest.Mock).mockResolvedValue(updatedWorkbook);

    const response = await supertest(app)
      .put(`/workbooks/${testWorkbook.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedWorkbook);
    expect(WorkbookService.updateWorkbook).toHaveBeenCalledWith(testWorkbook.id, updatedData);
  });

  it('DELETE /workbooks/:id deletes a workbook', async () => {
    const testWorkbook: Workbook = { id: '1', name: 'Test Workbook', ownerId: 'user1' };

    (WorkbookService.deleteWorkbook as jest.Mock).mockResolvedValue(undefined);

    const response = await supertest(app)
      .delete(`/workbooks/${testWorkbook.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
    expect(WorkbookService.deleteWorkbook).toHaveBeenCalledWith(testWorkbook.id);
  });

  it('GET /workbooks retrieves user\'s workbooks', async () => {
    const testWorkbooks: Workbook[] = [
      { id: '1', name: 'Workbook 1', ownerId: 'user1' },
      { id: '2', name: 'Workbook 2', ownerId: 'user1' }
    ];

    (WorkbookService.getUserWorkbooks as jest.Mock).mockResolvedValue(testWorkbooks);

    const response = await supertest(app)
      .get('/workbooks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testWorkbooks);
    expect(WorkbookService.getUserWorkbooks).toHaveBeenCalledWith(expect.any(String));
  });

  it('POST /workbooks/:id/share shares a workbook', async () => {
    const testWorkbook: Workbook = { id: '1', name: 'Test Workbook', ownerId: 'user1' };
    const sharingDetails = { userId: 'user2', permission: 'read' };
    const sharedWorkbook = { ...testWorkbook, sharedWith: [sharingDetails] };

    (WorkbookService.shareWorkbook as jest.Mock).mockResolvedValue(sharedWorkbook);

    const response = await supertest(app)
      .post(`/workbooks/${testWorkbook.id}/share`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(sharingDetails);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(sharedWorkbook);
    expect(WorkbookService.shareWorkbook).toHaveBeenCalledWith(testWorkbook.id, sharingDetails.userId, sharingDetails.permission);
  });
});
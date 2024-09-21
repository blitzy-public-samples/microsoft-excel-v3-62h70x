import supertest from 'supertest';
import app from 'src/app';
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { WorksheetService } from 'src/backend/services/WorksheetService';
import { CellService } from 'src/backend/services/CellService';
import { UserService } from 'src/backend/services/UserService';
import { Workbook, Worksheet, Cell, User } from 'src/shared/types/index';
import { generateAuthToken } from 'tests/helpers/auth';
import { clearDatabase } from 'tests/helpers/database';

describe('Workbook Flow Integration Tests', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let userService: UserService;
  let workbookService: WorkbookService;
  let worksheetService: WorksheetService;
  let cellService: CellService;

  beforeAll(async () => {
    request = supertest(app);
    userService = new UserService();
    workbookService = new WorkbookService();
    worksheetService = new WorksheetService();
    cellService = new CellService();
    
    // Connect to the test database
    // This step depends on your database setup, adjust accordingly
    await connectToTestDatabase();
    
    // Create test users
    await userService.createUser({ username: 'testuser1', password: 'password1' });
    await userService.createUser({ username: 'testuser2', password: 'password2' });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await disconnectFromTestDatabase();
  });

  beforeEach(async () => {
    // Clear the database
    await clearDatabase();
    
    // Reset mock function calls if any mocks are used
    jest.clearAllMocks();
  });

  test('Complete workbook creation and editing flow', async () => {
    // Create a new user and generate an auth token
    const user = await userService.createUser({ username: 'testuser', password: 'password' });
    const token = generateAuthToken(user);

    // Send a POST request to create a new workbook
    const createWorkbookResponse = await request
      .post('/api/workbooks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Workbook' });

    // Assert that the workbook is created successfully
    expect(createWorkbookResponse.status).toBe(201);
    const workbook: Workbook = createWorkbookResponse.body;
    expect(workbook.name).toBe('Test Workbook');

    // Send a POST request to add a new worksheet to the workbook
    const createWorksheetResponse = await request
      .post(`/api/workbooks/${workbook.id}/worksheets`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sheet1' });

    // Assert that the worksheet is added successfully
    expect(createWorksheetResponse.status).toBe(201);
    const worksheet: Worksheet = createWorksheetResponse.body;
    expect(worksheet.name).toBe('Sheet1');

    // Send PUT requests to update multiple cells in the worksheet
    const updateCellsResponse = await request
      .put(`/api/workbooks/${workbook.id}/worksheets/${worksheet.id}/cells`)
      .set('Authorization', `Bearer ${token}`)
      .send([
        { row: 0, column: 0, value: 10 },
        { row: 0, column: 1, value: 20 },
        { row: 1, column: 0, formula: '=A1+B1' }
      ]);

    // Assert that the cells are updated correctly
    expect(updateCellsResponse.status).toBe(200);
    const updatedCells: Cell[] = updateCellsResponse.body;
    expect(updatedCells).toHaveLength(3);
    expect(updatedCells[2].value).toBe(30);

    // Send a GET request to retrieve the updated workbook
    const getWorkbookResponse = await request
      .get(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token}`);

    // Assert that the workbook contains the correct worksheets and cell data
    expect(getWorkbookResponse.status).toBe(200);
    const updatedWorkbook: Workbook = getWorkbookResponse.body;
    expect(updatedWorkbook.worksheets).toHaveLength(1);
    expect(updatedWorkbook.worksheets[0].cells).toHaveLength(3);

    // Send a PUT request to update the workbook name
    const updateWorkbookResponse = await request
      .put(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Test Workbook' });

    // Assert that the workbook name is updated successfully
    expect(updateWorkbookResponse.status).toBe(200);
    const finalWorkbook: Workbook = updateWorkbookResponse.body;
    expect(finalWorkbook.name).toBe('Updated Test Workbook');
  });

  test('Workbook sharing and collaboration', async () => {
    // Create two users and generate auth tokens for both
    const user1 = await userService.createUser({ username: 'user1', password: 'password1' });
    const user2 = await userService.createUser({ username: 'user2', password: 'password2' });
    const token1 = generateAuthToken(user1);
    const token2 = generateAuthToken(user2);

    // User 1 creates a new workbook
    const createWorkbookResponse = await request
      .post('/api/workbooks')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Shared Workbook' });

    const workbook: Workbook = createWorkbookResponse.body;

    // User 1 shares the workbook with User 2
    const shareWorkbookResponse = await request
      .post(`/api/workbooks/${workbook.id}/share`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ userId: user2.id, permission: 'edit' });

    expect(shareWorkbookResponse.status).toBe(200);

    // Assert that User 2 can access the shared workbook
    const getWorkbookResponse = await request
      .get(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(getWorkbookResponse.status).toBe(200);

    // User 2 adds a new worksheet to the shared workbook
    const createWorksheetResponse = await request
      .post(`/api/workbooks/${workbook.id}/worksheets`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ name: 'Sheet2' });

    expect(createWorksheetResponse.status).toBe(201);
    const worksheet: Worksheet = createWorksheetResponse.body;

    // User 1 updates cells in the new worksheet
    const updateCellsResponse = await request
      .put(`/api/workbooks/${workbook.id}/worksheets/${worksheet.id}/cells`)
      .set('Authorization', `Bearer ${token1}`)
      .send([
        { row: 0, column: 0, value: 'Shared' },
        { row: 0, column: 1, value: 'Data' }
      ]);

    expect(updateCellsResponse.status).toBe(200);

    // Assert that both users can see the changes in real-time
    const getWorkbookResponse1 = await request
      .get(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token1}`);

    const getWorkbookResponse2 = await request
      .get(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(getWorkbookResponse1.body).toEqual(getWorkbookResponse2.body);

    // Test concurrent editing by having both users update different cells simultaneously
    const updateCell1Promise = request
      .put(`/api/workbooks/${workbook.id}/worksheets/${worksheet.id}/cells`)
      .set('Authorization', `Bearer ${token1}`)
      .send([{ row: 1, column: 0, value: 'User1' }]);

    const updateCell2Promise = request
      .put(`/api/workbooks/${workbook.id}/worksheets/${worksheet.id}/cells`)
      .set('Authorization', `Bearer ${token2}`)
      .send([{ row: 1, column: 1, value: 'User2' }]);

    await Promise.all([updateCell1Promise, updateCell2Promise]);

    // Assert that the final workbook state reflects all changes correctly
    const finalWorkbookResponse = await request
      .get(`/api/workbooks/${workbook.id}`)
      .set('Authorization', `Bearer ${token1}`);

    const finalWorkbook: Workbook = finalWorkbookResponse.body;
    expect(finalWorkbook.worksheets[1].cells).toContainEqual({ row: 1, column: 0, value: 'User1' });
    expect(finalWorkbook.worksheets[1].cells).toContainEqual({ row: 1, column: 1, value: 'User2' });
  });

  test('Workbook formula calculation and dependency updates', async () => {
    const user = await userService.createUser({ username: 'formulauser', password: 'password' });
    const token = generateAuthToken(user);

    // Create a new workbook with multiple worksheets
    const workbook: Workbook = await workbookService.createWorkbook(user.id, 'Formula Workbook');
    const worksheet1: Worksheet = await worksheetService.createWorksheet(workbook.id, 'Sheet1');
    const worksheet2: Worksheet = await worksheetService.createWorksheet(workbook.id, 'Sheet2');

    // Add cells with formulas that reference other cells within the same worksheet
    await cellService.updateCell(worksheet1.id, { row: 0, column: 0, value: 10 });
    await cellService.updateCell(worksheet1.id, { row: 0, column: 1, value: 20 });
    await cellService.updateCell(worksheet1.id, { row: 1, column: 0, formula: '=A1+B1' });

    // Add cells with formulas that reference cells in other worksheets
    await cellService.updateCell(worksheet2.id, { row: 0, column: 0, formula: '=Sheet1!A1*2' });

    // Update values in cells that are referenced by formulas
    await cellService.updateCell(worksheet1.id, { row: 0, column: 0, value: 15 });

    // Assert that all dependent cells are recalculated correctly
    const updatedWorkbook = await workbookService.getWorkbook(workbook.id);
    expect(updatedWorkbook.worksheets[0].cells[2].value).toBe(35); // A1(15) + B1(20)
    expect(updatedWorkbook.worksheets[1].cells[0].value).toBe(30); // Sheet1!A1(15) * 2

    // Test complex formulas involving multiple operations and cell ranges
    await cellService.updateCell(worksheet1.id, { row: 2, column: 0, formula: '=SUM(A1:B1) * 2' });
    const complexFormulaResult = await cellService.getCellValue(worksheet1.id, { row: 2, column: 0 });
    expect(complexFormulaResult).toBe(70); // (15 + 20) * 2

    // Verify that circular references are handled appropriately
    const circularReferenceResponse = await request
      .put(`/api/workbooks/${workbook.id}/worksheets/${worksheet1.id}/cells`)
      .set('Authorization', `Bearer ${token}`)
      .send([{ row: 3, column: 0, formula: '=A4' }, { row: 3, column: 1, formula: '=A3' }]);

    expect(circularReferenceResponse.status).toBe(400);
    expect(circularReferenceResponse.body.error).toContain('Circular reference detected');
  });

  test('Workbook import and export', async () => {
    const user = await userService.createUser({ username: 'importexportuser', password: 'password' });
    const token = generateAuthToken(user);

    // Create a new workbook with various data types and formulas
    const createWorkbookResponse = await request
      .post('/api/workbooks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Import Export Test' });

    const workbook: Workbook = createWorkbookResponse.body;

    await request
      .put(`/api/workbooks/${workbook.id}/worksheets/${workbook.worksheets[0].id}/cells`)
      .set('Authorization', `Bearer ${token}`)
      .send([
        { row: 0, column: 0, value: 'Text' },
        { row: 0, column: 1, value: 42 },
        { row: 0, column: 2, value: true },
        { row: 1, column: 0, formula: '=B1*2' }
      ]);

    // Export the workbook to different formats (e.g., XLSX, CSV)
    const xlsxExportResponse = await request
      .get(`/api/workbooks/${workbook.id}/export?format=xlsx`)
      .set('Authorization', `Bearer ${token}`);

    expect(xlsxExportResponse.status).toBe(200);
    expect(xlsxExportResponse.header['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const csvExportResponse = await request
      .get(`/api/workbooks/${workbook.id}/export?format=csv`)
      .set('Authorization', `Bearer ${token}`);

    expect(csvExportResponse.status).toBe(200);
    expect(csvExportResponse.header['content-type']).toBe('text/csv');

    // Assert that the exported files contain the correct data
    // Note: For a real test, you'd need to parse the XLSX and CSV content and verify the data

    // Import the exported files as new workbooks
    const xlsxImportResponse = await request
      .post('/api/workbooks/import')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', xlsxExportResponse.body, 'test.xlsx');

    expect(xlsxImportResponse.status).toBe(201);
    const importedXlsxWorkbook: Workbook = xlsxImportResponse.body;

    const csvImportResponse = await request
      .post('/api/workbooks/import')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', csvExportResponse.body, 'test.csv');

    expect(csvImportResponse.status).toBe(201);
    const importedCsvWorkbook: Workbook = csvImportResponse.body;

    // Verify that the imported workbooks maintain the original data and structure
    expect(importedXlsxWorkbook.worksheets[0].cells).toHaveLength(4);
    expect(importedCsvWorkbook.worksheets[0].cells).toHaveLength(4);

    // Test importing invalid or corrupted files and assert proper error handling
    const invalidFileResponse = await request
      .post('/api/workbooks/import')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('Invalid content'), 'invalid.xlsx');

    expect(invalidFileResponse.status).toBe(400);
    expect(invalidFileResponse.body.error).toContain('Invalid file format');
  });
});
import { WorkbookService } from 'src/backend/services/WorkbookService';
import { Workbook } from 'src/core/models/Workbook';
import { User } from 'src/core/models/User';
import mongoose from 'mongoose';
import { mockWorkbookModel } from 'tests/mocks/mockWorkbookModel';
import { mockUserModel } from 'tests/mocks/mockUserModel';

describe('WorkbookService', () => {
  let workbookService: WorkbookService;
  let mockUser: User;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    workbookService = new WorkbookService(mockWorkbookModel, mockUserModel);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await mockWorkbookModel.deleteMany({});
    await mockUserModel.deleteMany({});
    jest.clearAllMocks();
    mockUser = await mockUserModel.create({ name: 'Test User', email: 'test@example.com' });
  });

  it('creates a new workbook', async () => {
    const workbookName = 'Test Workbook';
    const newWorkbook = await workbookService.createWorkbook(workbookName, mockUser);

    expect(newWorkbook.name).toBe(workbookName);
    expect(newWorkbook.owner.toString()).toBe(mockUser._id.toString());
    expect(newWorkbook.worksheets.length).toBe(1);
    expect(newWorkbook.worksheets[0].name).toBe('Sheet1');
  });

  it('retrieves a workbook by ID', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }],
    });

    const retrievedWorkbook = await workbookService.getWorkbook(mockWorkbook._id);

    expect(retrievedWorkbook).toBeDefined();
    expect(retrievedWorkbook!.name).toBe(mockWorkbook.name);
    expect(retrievedWorkbook!.owner.toString()).toBe(mockUser._id.toString());
  });

  it('updates a workbook', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }],
    });

    const updatedName = 'Updated Workbook';
    const updatedWorkbook = await workbookService.updateWorkbook(mockWorkbook._id, { name: updatedName });

    expect(updatedWorkbook).toBeDefined();
    expect(updatedWorkbook!.name).toBe(updatedName);
  });

  it('deletes a workbook', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }],
    });

    await workbookService.deleteWorkbook(mockWorkbook._id);

    const deletedWorkbook = await mockWorkbookModel.findById(mockWorkbook._id);
    expect(deletedWorkbook).toBeNull();
  });

  it('adds a worksheet to a workbook', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }],
    });

    const newWorksheetName = 'New Sheet';
    const updatedWorkbook = await workbookService.addWorksheet(mockWorkbook._id, newWorksheetName);

    expect(updatedWorkbook.worksheets.length).toBe(2);
    expect(updatedWorkbook.worksheets[1].name).toBe(newWorksheetName);
  });

  it('removes a worksheet from a workbook', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }, { name: 'Sheet2' }],
    });

    const worksheetToRemove = mockWorkbook.worksheets[1];
    const updatedWorkbook = await workbookService.removeWorksheet(mockWorkbook._id, worksheetToRemove._id);

    expect(updatedWorkbook.worksheets.length).toBe(1);
    expect(updatedWorkbook.worksheets[0].name).toBe('Sheet1');
  });

  it('shares a workbook with another user', async () => {
    const mockWorkbook = await mockWorkbookModel.create({
      name: 'Test Workbook',
      owner: mockUser._id,
      worksheets: [{ name: 'Sheet1' }],
    });

    const anotherUser = await mockUserModel.create({ name: 'Another User', email: 'another@example.com' });
    const permission = 'read';

    const updatedWorkbook = await workbookService.shareWorkbook(mockWorkbook._id, anotherUser._id, permission);

    expect(updatedWorkbook.sharedWith).toBeDefined();
    expect(updatedWorkbook.sharedWith.length).toBe(1);
    expect(updatedWorkbook.sharedWith[0].user.toString()).toBe(anotherUser._id.toString());
    expect(updatedWorkbook.sharedWith[0].permission).toBe(permission);

    const sharedWorkbooks = await workbookService.getSharedWorkbooks(anotherUser._id);
    expect(sharedWorkbooks.length).toBe(1);
    expect(sharedWorkbooks[0]._id.toString()).toBe(mockWorkbook._id.toString());
  });
});
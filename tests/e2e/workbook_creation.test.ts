import { test, expect } from '@playwright/test';
import { LoginPage } from 'src/tests/e2e/pages/LoginPage';
import { HomePage } from 'src/tests/e2e/pages/HomePage';
import { WorkbookPage } from 'src/tests/e2e/pages/WorkbookPage';

test.describe('Workbook Creation E2E Test', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let workbookPage: WorkbookPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    workbookPage = new WorkbookPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'password123');
  });

  test('Create a new workbook and add worksheets', async () => {
    await homePage.clickCreateNewWorkbook();
    await expect(workbookPage.getWorkbookTitle()).toContain('Untitled Workbook');

    await workbookPage.addNewWorksheet();
    const worksheetCount = await workbookPage.getWorksheetCount();
    expect(worksheetCount).toBe(2);

    const newWorksheetName = 'New Worksheet';
    await workbookPage.renameWorksheet(1, newWorksheetName);
    expect(await workbookPage.getWorksheetName(1)).toBe(newWorksheetName);
  });

  test('Enter data into cells and perform basic calculations', async () => {
    await homePage.clickCreateNewWorkbook();
    
    await workbookPage.enterCellData('A1', '10');
    await workbookPage.enterCellData('A2', '20');
    await workbookPage.enterCellData('A3', '=SUM(A1:A2)');

    expect(await workbookPage.getCellValue('A3')).toBe('30');

    await workbookPage.enterCellData('A1', '15');
    expect(await workbookPage.getCellValue('A3')).toBe('35');
  });

  test('Apply formatting to cells', async () => {
    await homePage.clickCreateNewWorkbook();

    await workbookPage.enterCellData('A1', 'Bold Text');
    await workbookPage.applyBoldFormatting('A1');
    
    await workbookPage.selectCellRange('B1:D3');
    await workbookPage.applyBackgroundColor('B1:D3', '#FF0000');

    await workbookPage.enterCellData('E1', '1000');
    await workbookPage.applyCurrencyFormatting('E1');

    expect(await workbookPage.getCellFormatting('A1')).toContain('font-weight: bold');
    expect(await workbookPage.getCellFormatting('C2')).toContain('background-color: #FF0000');
    expect(await workbookPage.getCellValue('E1')).toMatch(/^\$1,000\.00$/);
  });

  test('Save and reopen a workbook', async () => {
    await homePage.clickCreateNewWorkbook();
    
    await workbookPage.enterCellData('A1', 'Test Data');
    await workbookPage.applyBoldFormatting('A1');

    const workbookName = 'Test Workbook';
    await workbookPage.saveWorkbook(workbookName);
    await workbookPage.closeWorkbook();

    await homePage.openWorkbook(workbookName);
    
    expect(await workbookPage.getCellValue('A1')).toBe('Test Data');
    expect(await workbookPage.getCellFormatting('A1')).toContain('font-weight: bold');
  });
});

// TODO: Implement the following tests
// - Importing data from external sources (e.g., CSV files)
// - Creating charts and graphs within the workbook
// - Collaborative editing features
// - Different workbook templates
// - Mobile responsiveness of the workbook creation process
// - Keyboard navigation and shortcuts in the workbook interface
// - Error handling during workbook creation and data entry
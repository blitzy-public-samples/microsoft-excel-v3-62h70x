#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <QTest>
#include "src/desktop/workbook_window.h"
#include "src/core/excel_core.h"
#include "src/core/models/workbook.h"

using ::testing::_;
using ::testing::Return;

class WorkbookWindowTest : public ::testing::Test {
protected:
    WorkbookWindow* m_workbookWindow;
    ExcelCore* m_mockExcelCore;

    void SetUp() override {
        m_mockExcelCore = new ::testing::NiceMock<MockExcelCore>();
        m_workbookWindow = new WorkbookWindow(m_mockExcelCore);
    }

    void TearDown() override {
        delete m_workbookWindow;
        delete m_mockExcelCore;
    }
};

TEST_F(WorkbookWindowTest, InitializesWithCorrectTitle) {
    EXPECT_TRUE(m_workbookWindow->windowTitle().contains("Microsoft Excel"));
}

TEST_F(WorkbookWindowTest, NewWorkbookCreationUpdatesUI) {
    int initialTabCount = m_workbookWindow->tabWidget()->count();
    m_workbookWindow->newWorkbook();
    
    EXPECT_EQ(m_workbookWindow->tabWidget()->count(), initialTabCount + 1);
    EXPECT_TRUE(m_workbookWindow->windowTitle().contains("New Workbook"));
}

TEST_F(WorkbookWindowTest, OpeningExistingWorkbookLoadsContentCorrectly) {
    Workbook mockWorkbook;
    mockWorkbook.setName("Test Workbook");
    mockWorkbook.addWorksheet("Sheet1");
    mockWorkbook.addWorksheet("Sheet2");

    EXPECT_CALL(*m_mockExcelCore, openWorkbook(_))
        .WillOnce(Return(mockWorkbook));

    m_workbookWindow->openWorkbook("test.xlsx");

    EXPECT_EQ(m_workbookWindow->tabWidget()->count(), 2);
    EXPECT_TRUE(m_workbookWindow->windowTitle().contains("Test Workbook"));
}

TEST_F(WorkbookWindowTest, SavingWorkbookTriggersCorrectExcelCoreMethod) {
    EXPECT_CALL(*m_mockExcelCore, saveWorkbook(_))
        .Times(1);

    m_workbookWindow->saveWorkbook();
}

TEST_F(WorkbookWindowTest, ClosingWorkbookPromptsForSaveOnUnsavedChanges) {
    // Simulate unsaved changes
    m_workbookWindow->setHasUnsavedChanges(true);

    // Mock the QMessageBox::question to return QMessageBox::Save
    QTest::ignoreMessage(QtWarningMsg, "QWidget: Cannot create a QWidget without QApplication");
    QTest::keyClick(m_workbookWindow, Qt::Key_Enter);

    EXPECT_CALL(*m_mockExcelCore, saveWorkbook(_))
        .Times(1);

    m_workbookWindow->closeWorkbook();
}

// Implement additional tests here
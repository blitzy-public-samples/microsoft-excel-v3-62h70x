#include <QApplication>
#include <QMainWindow>
#include "src/desktop/workbook_window.h"
#include "src/core/excel_core.h"

int main(int argc, char** argv) {
    // Create a QApplication instance
    QApplication app(argc, argv);

    // Initialize ExcelCore
    ExcelCore excelCore;
    if (!excelCore.initialize()) {
        // TODO: Add proper error handling and logging
        return 1;
    }

    // Create a WorkbookWindow instance
    WorkbookWindow workbookWindow(&excelCore);

    // Show the WorkbookWindow
    workbookWindow.show();

    // Enter the application event loop
    int exitCode = app.exec();

    // Clean up ExcelCore
    excelCore.cleanup();

    // Return the application exit code
    return exitCode;
}
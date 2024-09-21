#ifndef WORKBOOK_WINDOW_H
#define WORKBOOK_WINDOW_H

#include <QMainWindow>
#include <QTabWidget>
#include "src/core/excel_core.h"
#include "src/core/models/workbook.h"

class WorkbookWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit WorkbookWindow(QWidget* parent = nullptr);

    void newWorkbook();
    void openWorkbook();
    void saveWorkbook();
    void saveWorkbookAs();
    void closeWorkbook();

private:
    void createMenuBar();
    void createToolBars();

    QTabWidget* m_tabWidget;
    ExcelCore* m_excelCore;
    Workbook* m_currentWorkbook;
};

#endif // WORKBOOK_WINDOW_H
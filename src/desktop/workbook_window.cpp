#include "src/desktop/workbook_window.h"
#include <QMenuBar>
#include <QToolBar>
#include <QStatusBar>
#include <QTabWidget>
#include <QFileDialog>
#include <QMessageBox>
#include "src/desktop/worksheet_view.h"
#include "src/core/excel_core.h"
#include "src/core/models/workbook.h"

WorkbookWindow::WorkbookWindow(QWidget* parent) : QMainWindow(parent)
{
    // Initialize ExcelCore
    m_excelCore = new ExcelCore();

    // Set up main window properties
    setWindowTitle("Microsoft Excel");
    resize(1024, 768);

    // Create and set up the central widget (QTabWidget)
    m_tabWidget = new QTabWidget(this);
    setCentralWidget(m_tabWidget);

    // Create and set up the menu bar
    createMenuBar();

    // Create and set up the toolbars
    createToolBars();

    // Create and set up the status bar
    statusBar()->showMessage("Ready");

    // Connect signals and slots
    // TODO: Add necessary connections
}

void WorkbookWindow::createMenuBar()
{
    QMenuBar* menuBar = new QMenuBar(this);

    // File menu
    QMenu* fileMenu = menuBar->addMenu("&File");
    fileMenu->addAction("&New", this, &WorkbookWindow::newWorkbook, QKeySequence::New);
    fileMenu->addAction("&Open", this, &WorkbookWindow::openWorkbook, QKeySequence::Open);
    fileMenu->addAction("&Save", this, &WorkbookWindow::saveWorkbook, QKeySequence::Save);
    fileMenu->addAction("Save &As", this, &WorkbookWindow::saveWorkbookAs);
    fileMenu->addSeparator();
    fileMenu->addAction("&Close", this, &WorkbookWindow::closeWorkbook);
    fileMenu->addAction("E&xit", this, &QWidget::close);

    // Edit menu
    QMenu* editMenu = menuBar->addMenu("&Edit");
    editMenu->addAction("&Undo", this, &WorkbookWindow::undo, QKeySequence::Undo);
    editMenu->addAction("&Redo", this, &WorkbookWindow::redo, QKeySequence::Redo);
    editMenu->addSeparator();
    editMenu->addAction("Cu&t", this, &WorkbookWindow::cut, QKeySequence::Cut);
    editMenu->addAction("&Copy", this, &WorkbookWindow::copy, QKeySequence::Copy);
    editMenu->addAction("&Paste", this, &WorkbookWindow::paste, QKeySequence::Paste);

    // View menu
    QMenu* viewMenu = menuBar->addMenu("&View");
    viewMenu->addAction("Zoom &In", this, &WorkbookWindow::zoomIn);
    viewMenu->addAction("Zoom &Out", this, &WorkbookWindow::zoomOut);
    viewMenu->addAction("&Normal View", this, &WorkbookWindow::normalView);

    // Insert menu
    QMenu* insertMenu = menuBar->addMenu("&Insert");
    insertMenu->addAction("Insert &Row", this, &WorkbookWindow::insertRow);
    insertMenu->addAction("Insert &Column", this, &WorkbookWindow::insertColumn);
    insertMenu->addAction("Insert &Chart", this, &WorkbookWindow::insertChart);

    // Format menu
    QMenu* formatMenu = menuBar->addMenu("F&ormat");
    formatMenu->addAction("&Cell Format", this, &WorkbookWindow::cellFormat);
    formatMenu->addAction("&Conditional Formatting", this, &WorkbookWindow::conditionalFormatting);

    // Tools menu
    QMenu* toolsMenu = menuBar->addMenu("&Tools");
    toolsMenu->addAction("&Spell Check", this, &WorkbookWindow::spellCheck);
    toolsMenu->addAction("&Protect Sheet", this, &WorkbookWindow::protectSheet);

    // Help menu
    QMenu* helpMenu = menuBar->addMenu("&Help");
    helpMenu->addAction("&About", this, &WorkbookWindow::about);
    helpMenu->addAction("&Documentation", this, &WorkbookWindow::showDocumentation);

    setMenuBar(menuBar);
}

void WorkbookWindow::createToolBars()
{
    // Standard toolbar
    QToolBar* standardToolBar = addToolBar("Standard");
    standardToolBar->addAction("New", this, &WorkbookWindow::newWorkbook);
    standardToolBar->addAction("Open", this, &WorkbookWindow::openWorkbook);
    standardToolBar->addAction("Save", this, &WorkbookWindow::saveWorkbook);
    standardToolBar->addAction("Print", this, &WorkbookWindow::print);

    // Formatting toolbar
    QToolBar* formattingToolBar = addToolBar("Formatting");
    formattingToolBar->addAction("Bold", this, &WorkbookWindow::toggleBold);
    formattingToolBar->addAction("Italic", this, &WorkbookWindow::toggleItalic);
    formattingToolBar->addAction("Underline", this, &WorkbookWindow::toggleUnderline);

    // Formula toolbar
    QToolBar* formulaToolBar = addToolBar("Formula");
    formulaToolBar->addAction("AutoSum", this, &WorkbookWindow::autoSum);
    formulaToolBar->addAction("Functions", this, &WorkbookWindow::showFunctions);
}

void WorkbookWindow::newWorkbook()
{
    m_currentWorkbook = m_excelCore->createNewWorkbook();
    WorksheetView* worksheetView = new WorksheetView(m_currentWorkbook->getActiveWorksheet(), this);
    m_tabWidget->addTab(worksheetView, "Sheet1");
    setWindowTitle("New Workbook - Microsoft Excel");
}

void WorkbookWindow::openWorkbook()
{
    QString fileName = QFileDialog::getOpenFileName(this, "Open Workbook", "", "Excel Files (*.xlsx *.xls)");
    if (!fileName.isEmpty()) {
        m_currentWorkbook = m_excelCore->openWorkbook(fileName);
        if (m_currentWorkbook) {
            for (const auto& worksheet : m_currentWorkbook->getWorksheets()) {
                WorksheetView* worksheetView = new WorksheetView(worksheet, this);
                m_tabWidget->addTab(worksheetView, worksheet->getName());
            }
            setWindowTitle(fileName + " - Microsoft Excel");
        }
    }
}

void WorkbookWindow::saveWorkbook()
{
    if (m_currentWorkbook && m_currentWorkbook->getFilePath().isEmpty()) {
        saveWorkbookAs();
    } else if (m_currentWorkbook) {
        m_excelCore->saveWorkbook(m_currentWorkbook);
        statusBar()->showMessage("Workbook saved", 3000);
    }
}

void WorkbookWindow::saveWorkbookAs()
{
    if (m_currentWorkbook) {
        QString fileName = QFileDialog::getSaveFileName(this, "Save Workbook", "", "Excel Files (*.xlsx)");
        if (!fileName.isEmpty()) {
            m_excelCore->saveWorkbookAs(m_currentWorkbook, fileName);
            setWindowTitle(fileName + " - Microsoft Excel");
            statusBar()->showMessage("Workbook saved", 3000);
        }
    }
}

void WorkbookWindow::closeWorkbook()
{
    if (m_currentWorkbook) {
        if (m_currentWorkbook->hasUnsavedChanges()) {
            QMessageBox::StandardButton reply;
            reply = QMessageBox::question(this, "Unsaved Changes", "Do you want to save changes before closing?",
                                          QMessageBox::Yes|QMessageBox::No|QMessageBox::Cancel);
            if (reply == QMessageBox::Yes) {
                saveWorkbook();
            } else if (reply == QMessageBox::Cancel) {
                return;
            }
        }
        m_tabWidget->clear();
        delete m_currentWorkbook;
        m_currentWorkbook = nullptr;
        setWindowTitle("Microsoft Excel");
    }
}

// TODO: Implement other member functions (undo, redo, cut, copy, paste, etc.)
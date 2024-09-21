#include "src/desktop/worksheet_view.h"
#include <QHeaderView>
#include <QScrollBar>
#include <QPainter>
#include <QMouseEvent>
#include <QKeyEvent>
#include "src/desktop/cell_grid.h"
#include "src/core/models/worksheet.h"
#include "src/core/models/cell.h"

WorksheetView::WorksheetView(Worksheet* worksheet, QWidget* parent)
    : QWidget(parent)
    , m_worksheet(worksheet)
    , m_cellGrid(nullptr)
    , m_horizontalHeader(nullptr)
    , m_verticalHeader(nullptr)
    , m_selectedCell(nullptr)
    , m_zoomFactor(1.0)
{
    // Create and set up m_cellGrid
    m_cellGrid = new CellGrid(m_worksheet, this);

    // Create and set up m_horizontalHeader and m_verticalHeader
    m_horizontalHeader = new QHeaderView(Qt::Horizontal, this);
    m_verticalHeader = new QHeaderView(Qt::Vertical, this);

    // Set up the layout to include headers and cell grid
    QGridLayout* layout = new QGridLayout(this);
    layout->addWidget(m_horizontalHeader, 0, 1);
    layout->addWidget(m_verticalHeader, 1, 0);
    layout->addWidget(m_cellGrid, 1, 1);

    // Set default zoom factor
    setZoomFactor(1.0);

    // Connect signals and slots
    connect(m_cellGrid, &CellGrid::cellSelected, this, &WorksheetView::onCellSelected);
}

void WorksheetView::paintEvent(QPaintEvent* event)
{
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);

    // Apply the current zoom factor
    painter.scale(m_zoomFactor, m_zoomFactor);

    // Draw the grid lines
    drawGridLines(&painter);

    // Draw the cell contents
    drawCellContents(&painter);

    // Draw the selection rectangle for the active cell
    drawSelectionRectangle(&painter);
}

void WorksheetView::mousePressEvent(QMouseEvent* event)
{
    // Calculate the cell coordinates from the mouse position
    QPoint cellPos = m_cellGrid->mapFromParent(event->pos());
    QModelIndex index = m_cellGrid->indexAt(cellPos);

    // Update the selected cell
    if (index.isValid()) {
        m_selectedCell = m_worksheet->cellAt(index.row(), index.column());
        emit cellSelected(m_selectedCell);
    }

    // Update the view
    update();
}

void WorksheetView::keyPressEvent(QKeyEvent* event)
{
    switch (event->key()) {
    case Qt::Key_Left:
    case Qt::Key_Right:
    case Qt::Key_Up:
    case Qt::Key_Down:
    case Qt::Key_Tab:
    case Qt::Key_Enter:
    case Qt::Key_Return:
        navigateCell(event->key());
        break;
    case Qt::Key_F2:
        startCellEditing();
        break;
    default:
        if (!event->text().isEmpty()) {
            startCellEditing(event->text());
        }
        break;
    }

    // Update the view
    update();
}

void WorksheetView::updateCellContent(const QModelIndex& index, const QVariant& value)
{
    // Get the cell at the given index
    Cell* cell = m_worksheet->cellAt(index.row(), index.column());
    if (!cell) return;

    // Update the cell's value or formula
    cell->setValue(value.toString());

    // Trigger recalculation of dependent cells
    m_worksheet->recalculateDependentCells(cell);

    // Update the view
    update();
}

void WorksheetView::zoomIn()
{
    setZoomFactor(m_zoomFactor * 1.1);
}

void WorksheetView::zoomOut()
{
    setZoomFactor(m_zoomFactor / 1.1);
}

void WorksheetView::setZoomFactor(qreal factor)
{
    m_zoomFactor = qBound(0.1, factor, 5.0);
    
    // Update the view scale
    m_cellGrid->setTransform(QTransform().scale(m_zoomFactor, m_zoomFactor));

    // Adjust scroll bars
    adjustScrollBars();

    // Update the view
    update();
}

// Helper functions

void WorksheetView::drawGridLines(QPainter* painter)
{
    // Implementation for drawing grid lines
}

void WorksheetView::drawCellContents(QPainter* painter)
{
    // Implementation for drawing cell contents
}

void WorksheetView::drawSelectionRectangle(QPainter* painter)
{
    // Implementation for drawing selection rectangle
}

void WorksheetView::navigateCell(int key)
{
    // Implementation for cell navigation
}

void WorksheetView::startCellEditing(const QString& initialText)
{
    // Implementation for starting cell editing
}

void WorksheetView::adjustScrollBars()
{
    // Implementation for adjusting scroll bars
}

void WorksheetView::onCellSelected(Cell* cell)
{
    m_selectedCell = cell;
    // Additional logic for cell selection
}
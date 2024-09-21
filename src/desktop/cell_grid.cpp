#include "src/desktop/cell_grid.h"
#include <QPainter>
#include <QMouseEvent>
#include <QKeyEvent>
#include "src/core/models/cell.h"
#include "src/core/models/worksheet.h"
#include "src/core/models/cell_style.h"
#include "src/core/excel_core.h"

CellGrid::CellGrid(Worksheet* worksheet, ExcelCore* excelCore, QWidget* parent)
    : QWidget(parent)
    , m_worksheet(worksheet)
    , m_excelCore(excelCore)
    , m_selectedCell(0, 0)
    , m_selectionRect(0, 0, 1, 1)
    , m_zoomFactor(1.0)
{
    setFocusPolicy(Qt::StrongFocus);
    setMouseTracking(true);
}

void CellGrid::paintEvent(QPaintEvent* event)
{
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);
    painter.scale(m_zoomFactor, m_zoomFactor);

    // Calculate visible range of cells
    int startRow = 0, startCol = 0, endRow = m_worksheet->getRowCount(), endCol = m_worksheet->getColumnCount();
    // TODO: Optimize to only draw visible cells

    for (int row = startRow; row < endRow; ++row) {
        for (int col = startCol; col < endCol; ++col) {
            QRect cellRect = getCellRect(row, col);
            Cell* cell = m_worksheet->getCell(row, col);

            // Draw cell border
            painter.drawRect(cellRect);

            // Draw cell content
            if (cell) {
                painter.drawText(cellRect, Qt::AlignCenter, cell->getDisplayValue());
                
                // Apply cell style
                CellStyle style = cell->getStyle();
                // TODO: Apply background color, text alignment, etc.
            }
        }
    }

    // Draw selection rectangle
    painter.setPen(QPen(Qt::blue, 2));
    painter.drawRect(m_selectionRect);
}

void CellGrid::mousePressEvent(QMouseEvent* event)
{
    QPoint cellCoord = getCellCoordinates(event->pos());
    m_selectedCell = cellCoord;
    m_selectionRect = getCellRect(cellCoord.x(), cellCoord.y());

    emit cellSelected(cellCoord);
    update();
}

void CellGrid::keyPressEvent(QKeyEvent* event)
{
    switch (event->key()) {
        case Qt::Key_Left:
            if (m_selectedCell.x() > 0) m_selectedCell.setX(m_selectedCell.x() - 1);
            break;
        case Qt::Key_Right:
            if (m_selectedCell.x() < m_worksheet->getColumnCount() - 1) m_selectedCell.setX(m_selectedCell.x() + 1);
            break;
        case Qt::Key_Up:
            if (m_selectedCell.y() > 0) m_selectedCell.setY(m_selectedCell.y() - 1);
            break;
        case Qt::Key_Down:
            if (m_selectedCell.y() < m_worksheet->getRowCount() - 1) m_selectedCell.setY(m_selectedCell.y() + 1);
            break;
        case Qt::Key_F2:
            // TODO: Start cell editing mode
            break;
        default:
            if (event->text().length() == 1 && event->text()[0].isPrint()) {
                // Start editing with the pressed key
                setCellContent(m_selectedCell, event->text());
            }
            break;
    }

    m_selectionRect = getCellRect(m_selectedCell.x(), m_selectedCell.y());
    emit cellSelected(m_selectedCell);
    update();
}

void CellGrid::setCellContent(const QPoint& cellCoordinates, const QString& content)
{
    Cell* cell = m_worksheet->getCell(cellCoordinates.y(), cellCoordinates.x());
    if (!cell) {
        cell = new Cell(cellCoordinates.y(), cellCoordinates.x());
        m_worksheet->setCell(cellCoordinates.y(), cellCoordinates.x(), cell);
    }

    cell->setContent(content);
    m_excelCore->recalculateDependentCells(m_worksheet, cellCoordinates);

    emit cellContentChanged(cellCoordinates, content);
    update();
}

void CellGrid::setZoomFactor(qreal factor)
{
    m_zoomFactor = factor;
    // TODO: Recalculate cell dimensions and grid size
    update();
}

QRect CellGrid::getCellRect(int row, int col) const
{
    // TODO: Implement actual cell size calculation
    int cellWidth = 100;
    int cellHeight = 25;
    return QRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
}

QPoint CellGrid::getCellCoordinates(const QPoint& pos) const
{
    // TODO: Implement actual cell coordinate calculation based on position
    int cellWidth = 100;
    int cellHeight = 25;
    return QPoint(pos.x() / cellWidth, pos.y() / cellHeight);
}
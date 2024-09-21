#ifndef WORKSHEETVIEW_H
#define WORKSHEETVIEW_H

#include <QWidget>
#include <QHeaderView>
#include "src/core/models/worksheet.h"
#include "src/core/models/cell.h"
#include "src/desktop/cell_grid.h"

class WorksheetView : public QWidget
{
    Q_OBJECT

public:
    explicit WorksheetView(Worksheet* worksheet, QWidget* parent = nullptr);

    void paintEvent(QPaintEvent* event) override;
    void mousePressEvent(QMouseEvent* event) override;
    void keyPressEvent(QKeyEvent* event) override;

    void updateCellContent(const QModelIndex& index, const QVariant& value);
    void zoomIn();
    void zoomOut();

signals:
    void cellSelected(const Cell* cell);
    void contentChanged(const QModelIndex& index, const QVariant& value);

private:
    Worksheet* m_worksheet;
    CellGrid* m_cellGrid;
    QHeaderView* m_horizontalHeader;
    QHeaderView* m_verticalHeader;
    Cell* m_selectedCell;
    qreal m_zoomFactor;
};

#endif // WORKSHEETVIEW_H
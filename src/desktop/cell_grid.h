#ifndef CELL_GRID_H
#define CELL_GRID_H

#include <QWidget>
#include <QPoint>
#include <QRect>
#include "src/core/models/worksheet.h"
#include "src/core/excel_core.h"

class CellGrid : public QWidget
{
    Q_OBJECT

public:
    explicit CellGrid(Worksheet* worksheet, ExcelCore* excelCore, QWidget* parent = nullptr);

    void paintEvent(QPaintEvent* event) override;
    void mousePressEvent(QMouseEvent* event) override;
    void keyPressEvent(QKeyEvent* event) override;

    void setCellContent(const QPoint& cellCoordinates, const QString& content);
    void setZoomFactor(qreal factor);

signals:
    void cellSelected(const QPoint& cellCoordinates);
    void cellContentChanged(const QPoint& cellCoordinates, const QString& newContent);

private:
    Worksheet* m_worksheet;
    QPoint m_selectedCell;
    QRect m_selectionRect;
    qreal m_zoomFactor;
    ExcelCore* m_excelCore;
};

#endif // CELL_GRID_H
-- Create charts table to store chart information
-- worksheet_id: ID of the worksheet this chart belongs to
-- name: Name of the chart
-- type: Type of the chart (e.g., bar, line, pie)
-- data_range: Cell range containing the chart data
-- options: JSON object storing chart-specific options
-- position: JSON object storing chart position and size within the worksheet
-- created_at: Timestamp of chart creation
-- updated_at: Timestamp of last chart update

CREATE TABLE charts (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    data_range VARCHAR(255) NOT NULL,
    options JSONB,
    position JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worksheet_id) REFERENCES worksheets(id) ON DELETE CASCADE
);

CREATE INDEX idx_charts_worksheet_id ON charts (worksheet_id);
CREATE INDEX idx_charts_type ON charts (type);
-- Create cells table to store individual cell data
-- worksheet_id: ID of the worksheet this cell belongs to
-- row: Row number of the cell
-- column: Column number of the cell
-- value: Actual value stored in the cell
-- formula: Formula used to calculate the cell value (if applicable)
-- format: JSON object storing cell formatting information
-- created_at: Timestamp of cell creation
-- updated_at: Timestamp of last cell update

CREATE TABLE cells (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER NOT NULL,
    row INTEGER NOT NULL,
    column INTEGER NOT NULL,
    value TEXT,
    formula TEXT,
    format JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worksheet_id) REFERENCES worksheets(id) ON DELETE CASCADE
);

CREATE INDEX idx_cells_worksheet_id ON cells (worksheet_id);
CREATE UNIQUE INDEX idx_cells_worksheet_id_row_column ON cells (worksheet_id, row, column);
CREATE INDEX idx_cells_value ON cells USING gin (to_tsvector('english', value));

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_cells_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cells_updated_at_trigger
BEFORE UPDATE ON cells
FOR EACH ROW
EXECUTE FUNCTION update_cells_updated_at();

-- Add CHECK constraints for non-negative row and column values
ALTER TABLE cells ADD CONSTRAINT check_positive_row CHECK (row >= 0);
ALTER TABLE cells ADD CONSTRAINT check_positive_column CHECK (column >= 0);

-- Down migration
-- CREATE OR REPLACE FUNCTION down_migration_004()
-- RETURNS VOID AS $$
-- BEGIN
--     DROP TRIGGER IF EXISTS cells_updated_at_trigger ON cells;
--     DROP FUNCTION IF EXISTS update_cells_updated_at();
--     DROP TABLE IF EXISTS cells;
-- END;
-- $$ LANGUAGE plpgsql;
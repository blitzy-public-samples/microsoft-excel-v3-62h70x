-- Create worksheets table to store worksheet information
-- workbook_id: ID of the workbook this worksheet belongs to
-- name: Name of the worksheet
-- index: Order of the worksheet within the workbook
-- created_at: Timestamp of worksheet creation
-- updated_at: Timestamp of last worksheet update
-- row_count: Number of rows in the worksheet (default 1000)
-- column_count: Number of columns in the worksheet (default 26)

CREATE TABLE worksheets (
    id SERIAL PRIMARY KEY,
    workbook_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    row_count INTEGER DEFAULT 1000,
    column_count INTEGER DEFAULT 26,
    FOREIGN KEY (workbook_id) REFERENCES workbooks(id) ON DELETE CASCADE
);

CREATE INDEX idx_worksheets_workbook_id ON worksheets (workbook_id);
CREATE UNIQUE INDEX idx_worksheets_workbook_id_name ON worksheets (workbook_id, name);
CREATE INDEX idx_worksheets_workbook_id_index ON worksheets (workbook_id, index);

-- Human tasks:
-- 1. Review and adjust default values for row_count and column_count if necessary
-- 2. Consider adding a field for worksheet visibility (hidden/visible)
-- 3. Implement a trigger to automatically update the updated_at timestamp
-- 4. Add any additional worksheet-specific metadata fields if required
-- 5. Consider implementing a mechanism for worksheet templates
-- 6. Review and implement appropriate database-level constraints (e.g., CHECK constraints for non-negative row and column counts)
-- 7. Ensure the migration is reversible by creating a corresponding down migration
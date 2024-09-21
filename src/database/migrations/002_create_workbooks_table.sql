-- Create workbooks table to store workbook information
-- name: Name of the workbook
-- owner_id: ID of the user who owns the workbook
-- created_at: Timestamp of workbook creation
-- updated_at: Timestamp of last workbook update
-- last_modified_by: ID of the user who last modified the workbook
-- is_template: Flag to indicate if the workbook is a template

CREATE TABLE workbooks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INTEGER,
    is_template BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (last_modified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_workbooks_owner_id ON workbooks (owner_id);
CREATE INDEX idx_workbooks_name ON workbooks (name);
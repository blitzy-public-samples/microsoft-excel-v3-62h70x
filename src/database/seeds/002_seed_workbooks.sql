-- Seed the workbooks table with initial data
-- Note: The owner_id values correspond to user IDs from the users table
-- Some workbooks are marked as templates for testing template functionality

INSERT INTO workbooks (name, owner_id, is_template) VALUES
('Sample Budget', 1, false),
('Project Timeline', 2, false),
('Sales Report', 3, false),
('Expense Template', 1, true),
('Invoice Template', 2, true);
-- Seed the users table with initial data
-- Note: The password_hash values are placeholders and should be replaced with actual hashed passwords
-- The current hash is a dummy value and does not represent a real password

INSERT INTO users (email, password_hash, name, avatar) VALUES
('admin@example.com', '$2a$10$XQxOqPzWXOXYXYXYXYXYXOXYXYXYXYXYXYXYXYXYXYXYXYXYXYXY', 'Admin User', 'https://example.com/avatars/admin.png'),
('user1@example.com', '$2a$10$XQxOqPzWXOXYXYXYXYXYXOXYXYXYXYXYXYXYXYXYXYXYXYXYXYXY', 'User One', 'https://example.com/avatars/user1.png'),
('user2@example.com', '$2a$10$XQxOqPzWXOXYXYXYXYXYXOXYXYXYXYXYXYXYXYXYXYXYXYXYXYXY', 'User Two', 'https://example.com/avatars/user2.png');
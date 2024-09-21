-- Create users table to store user information
-- email: User's email address (used for login)
-- password_hash: Hashed password for security
-- name: User's full name
-- avatar: URL or path to user's avatar image
-- created_at: Timestamp of user creation
-- updated_at: Timestamp of last user update

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
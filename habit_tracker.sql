-- =============================================================
-- Daily Habit Tracker - Database Setup
-- Database: habit_tracker
-- Table:    habits
-- =============================================================
-- How to use:
--   1. Open phpMyAdmin (http://localhost/phpmyadmin)
--   2. Click "Import" in the top menu
--   3. Choose this file (habit_tracker.sql) and click "Go"
--
-- This script will create the database, the table, and insert
-- a few sample habits so the dashboard is not empty on first run.
-- =============================================================

-- Create the database (if it does not already exist)
CREATE DATABASE IF NOT EXISTS habit_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Switch to the new database so the table is created inside it
USE habit_tracker;

-- Drop the table first if it already exists (keeps imports clean)
DROP TABLE IF EXISTS habits;

-- Create the habits table
CREATE TABLE habits (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    habit_name  VARCHAR(150) NOT NULL,
    description TEXT,
    category    VARCHAR(50),
    status      ENUM('pending','completed') DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a few sample habits so you can see the app working right away
INSERT INTO habits (habit_name, description, category, status) VALUES
('Drink 8 glasses of water', 'Stay hydrated throughout the day', 'Health', 'pending'),
('Read for 30 minutes', 'Read a book or article to learn something new', 'Study', 'completed'),
('Morning jog', 'Run for 20 minutes every morning', 'Fitness', 'pending'),
('Journal entry', 'Write a short reflection about the day', 'Personal', 'pending');

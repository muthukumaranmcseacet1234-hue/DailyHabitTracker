<?php
/**
 * db.php
 * ---------------------------------------------------------------
 * Database connection file for the Daily Habit Tracker.
 *
 * This file is included by every other PHP API file so that
 * they all share the same database connection.
 *
 * Configuration (default XAMPP values):
 *   - Host:     localhost
 *   - User:     root
 *   - Password: (empty)
 *   - Database: habit_tracker
 *
 * We use PDO (PHP Data Objects) because it is secure, modern,
 * and supports prepared statements which prevent SQL injection.
 * ---------------------------------------------------------------
 */

// Database connection settings — change these only if your setup differs
$host     = 'localhost';
$dbname   = 'habit_tracker';
$user     = 'root';
$password = '';

// Tell the browser (and fetch()) that every response from this file is JSON
header('Content-Type: application/json; charset=utf-8');

try {
    // Create a PDO connection to MySQL
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            // Throw exceptions when something goes wrong so we can catch it
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            // Return rows as associative arrays (column name => value)
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    // If the connection fails, stop and send an error message as JSON
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

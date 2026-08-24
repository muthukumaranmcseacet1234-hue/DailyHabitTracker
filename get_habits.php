<?php
/**
 * get_habits.php
 * ---------------------------------------------------------------
 * Returns all habits from the database as JSON.
 *
 * Responds with JSON:
 *   Success: { "success": true, "habits": [ { ... }, { ... } ] }
 *   Error:   { "success": false, "message": "..." }
 * ---------------------------------------------------------------
 */

// Connect to the database (this also sets the JSON header)
require_once 'db.php';

// Only accept GET requests (reading data)
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only GET requests are allowed.']);
    exit;
}

try {
    // Order by newest first
    $stmt = $pdo->query('SELECT * FROM habits ORDER BY id DESC');
    $habits = $stmt->fetchAll();

    // Make id an integer for cleaner JSON
    foreach ($habits as &$habit) {
        $habit['id'] = (int) $habit['id'];
    }
    unset($habit);

    echo json_encode([
        'success' => true,
        'habits'  => $habits
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch habits: ' . $e->getMessage()]);
}

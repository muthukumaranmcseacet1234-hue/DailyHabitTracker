<?php
/**
 * delete_habit.php
 * ---------------------------------------------------------------
 * Deletes a habit from the database.
 *
 * Receives JSON from JavaScript that contains:
 *   - id (required, the habit's id)
 *
 * Responds with JSON:
 *   Success: { "success": true, "message": "..." }
 *   Error:   { "success" => false, "message" => "..." }
 * ---------------------------------------------------------------
 */

// Connect to the database (this also sets the JSON header)
require_once 'db.php';

// Only accept POST requests (we are deleting data)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed.']);
    exit;
}

// Read the JSON body sent by JavaScript
$rawInput  = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

if ($inputData === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data received.']);
    exit;
}

// Get the id and make sure it is a positive integer
$id = isset($inputData['id']) ? (int) $inputData['id'] : 0;

if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'A valid habit id is required.']);
    exit;
}

try {
    // Use a prepared statement to prevent SQL injection
    $sql  = 'DELETE FROM habits WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);

    // Check that a row was actually deleted
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Habit deleted successfully!'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Habit not found.'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete habit: ' . $e->getMessage()]);
}

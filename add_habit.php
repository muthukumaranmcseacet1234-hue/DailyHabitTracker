<?php
/**
 * add_habit.php
 * ---------------------------------------------------------------
 * Adds a new habit to the database.
 *
 * Receives JSON from JavaScript (sent with fetch) that contains:
 *   - habit_name  (required, text)
 *   - description (optional, text)
 *   - category    (required, one of: Health, Study, Fitness, Personal, Other)
 *
 * Responds with JSON:
 *   Success: { "success": true, "message": "...", "habit": { ... } }
 *   Error:   { "success": false, "message": "..." }
 * ---------------------------------------------------------------
 */

// Connect to the database (this also sets the JSON header)
require_once 'db.php';

// Only accept POST requests (creating a habit)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed.']);
    exit;
}

// Read the JSON body sent by JavaScript and turn it into a PHP array
$rawInput  = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

// If the JSON could not be parsed, stop with an error
if ($inputData === null) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data received.']);
    exit;
}

// Pull out the fields and remove extra spaces from the text ones
$habitName   = trim($inputData['habit_name']   ?? '');
$description = trim($inputData['description']  ?? '');
$category    = trim($inputData['category']     ?? '');

// ----- Validation -----
$allowedCategories = ['Health', 'Study', 'Fitness', 'Personal', 'Other'];

if ($habitName === '') {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(['success' => false, 'message' => 'Habit name is required.']);
    exit;
}

if (mb_strlen($habitName) > 150) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Habit name must be 150 characters or less.']);
    exit;
}

if (!in_array($category, $allowedCategories, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please choose a valid category.']);
    exit;
}

// If no description was given, store NULL instead of an empty string
if ($description === '') {
    $description = null;
}

// ----- Insert into MySQL using a prepared statement -----
// The ? marks are placeholders. The real values are sent separately by execute(),
// which protects us from SQL injection attacks.
$sql = 'INSERT INTO habits (habit_name, description, category) VALUES (?, ?, ?)';

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$habitName, $description, $category]);

    // Get the id of the new row
    $newId = $pdo->lastInsertId();

    // Build the new habit as an array so we can send it back to the frontend
    $newHabit = [
        'id'          => (int) $newId,
        'habit_name'  => $habitName,
        'description' => $description,
        'category'    => $category,
        'status'      => 'pending',
        'created_at'  => date('Y-m-d H:i:s')
    ];

    http_response_code(201); // Created
    echo json_encode([
        'success' => true,
        'message' => 'Habit added successfully!',
        'habit'   => $newHabit
    ]);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to add habit: ' . $e->getMessage()]);
}

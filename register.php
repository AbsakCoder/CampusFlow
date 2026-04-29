<?php
// register.php — CampusFlow real registration endpoint
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$fullName   = isset($input['fullName'])   ? trim($input['fullName'])   : '';
$userId     = isset($input['userId'])     ? trim($input['userId'])     : '';
$email      = isset($input['email'])      ? trim($input['email'])      : '';
$password   = isset($input['password'])   ? $input['password']         : '';
$department = isset($input['department']) ? trim($input['department']) : '';
$role       = isset($input['role'])       ? trim($input['role'])       : '';

// Validation
if (!$fullName || !$userId || !$email || !$password || !$department || !$role) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

$allowedRoles = ['Student' => 'student', 'Faculty' => 'faculty'];
if (!array_key_exists($role, $allowedRoles)) {
    echo json_encode(['success' => false, 'message' => 'Invalid role. Only Student or Faculty can register.']);
    exit;
}
$dbRole = $allowedRoles[$role];

require_once 'db_config.php';

// Check for duplicate email
$existing = db_query($conn, "SELECT id FROM users WHERE email = ? LIMIT 1", 's', [$email]);
if (!empty($existing)) {
    echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
    exit;
}

$hashedPassword = hash_password($password);

// Set enrollment_no or employee_id based on role
$enrollmentNo = ($dbRole === 'student') ? $userId : null;
$employeeId   = ($dbRole === 'faculty') ? $userId : null;

$affected = db_query(
    $conn,
    "INSERT INTO users (name, email, password, role, enrollment_no, employee_id, department)
     VALUES (?, ?, ?, ?, ?, ?, ?)",
    'sssssss',
    [$fullName, $email, $hashedPassword, $dbRole, $enrollmentNo, $employeeId, $department]
);

if ($affected > 0) {
    echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}

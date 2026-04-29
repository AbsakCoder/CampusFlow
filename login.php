<?php
// login.php — CampusFlow real authentication endpoint
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$email    = isset($input['email'])    ? trim($input['email'])    : '';
$password = isset($input['password']) ? trim($input['password']) : '';
$role     = isset($input['role'])     ? trim($input['role'])     : '';

// Basic validation
if (!$email || !$password || !$role) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// Normalise role to lowercase for DB comparison
$roleMap = ['Student' => 'student', 'Faculty' => 'faculty', 'Admin' => 'admin'];
if (!array_key_exists($role, $roleMap)) {
    echo json_encode(['success' => false, 'message' => 'Invalid role selected.']);
    exit;
}
$dbRole = $roleMap[$role];

require_once 'db_config.php';   // provides $conn and verify_password()

// Look up user by email + role
$rows = db_query(
    $conn,
    "SELECT id, name, email, password, role, enrollment_no, employee_id, department
     FROM users WHERE email = ? AND role = ? LIMIT 1",
    'ss',
    [$email, $dbRole]
);

if (empty($rows)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email, password, or role.']);
    exit;
}

$user = $rows[0];

// Verify SHA-256 hashed password
if (!verify_password($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email, password, or role.']);
    exit;
}

// Start session and store user info
session_start();
session_regenerate_id(true);

$_SESSION['cf_user_id']   = $user['id'];
$_SESSION['cf_name']      = $user['name'];
$_SESSION['cf_email']     = $user['email'];
$_SESSION['cf_role']      = $user['role'];
$_SESSION['cf_dept']      = $user['department'] ?? '';
$_SESSION['cf_enroll']    = $user['enrollment_no'] ?? '';
$_SESSION['cf_emp_id']    = $user['employee_id']   ?? '';

// Return success with user info (JS will store in localStorage for UI)
echo json_encode([
    'success' => true,
    'name'    => $user['name'],
    'role'    => ucfirst($user['role']),   // "Student" / "Faculty" / "Admin"
    'email'   => $user['email'],
    'dept'    => $user['department'] ?? '',
]);

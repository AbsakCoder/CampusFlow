<?php
define('DB_HOST',    'localhost');
define('DB_USER',    'root');
define('DB_PASS',    'venom');      // your MySQL password
define('DB_NAME',    'campusflow_db');
define('DB_CHARSET', 'utf8mb4');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    error_log('CampusFlow DB connection failed: ' . $conn->connect_error);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please contact admin.'
    ]));
}

$conn->set_charset(DB_CHARSET);
$conn->query("SET time_zone = '+05:30'");

function db_query(mysqli $db, string $sql, string $types = '', array $params = []): array|int
{
    $stmt = $db->prepare($sql);
    if (!$stmt) {
        error_log('Prepare failed: ' . $db->error . ' | SQL: ' . $sql);
        return [];
    }
    if ($types && $params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    if (in_array(strtoupper(substr(trim($sql), 0, 6)), ['INSERT', 'UPDATE', 'DELETE'])) {
        $affected = $stmt->affected_rows;
        $stmt->close();
        return $affected;
    }
    $result = $stmt->get_result();
    $rows   = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    $stmt->close();
    return $rows;
}

function hash_password(string $plain): string
{
    return hash('sha256', $plain);
}

function verify_password(string $plain, string $stored_hash): bool
{
    return hash_equals($stored_hash, hash_password($plain));
}
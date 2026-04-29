<?php
// ============================================================
//  CampusFlow — Full System Test Page
//  Visit: http://localhost/campusflow/test.php
//  DELETE THIS FILE before going live!
// ============================================================
session_start();
?>
<!DOCTYPE html>
<html>
<head>
<title>CampusFlow System Test</title>
<style>
  body { font-family: Arial, sans-serif; padding: 30px; background: #f4f4f4; }
  h1   { color: #333; }
  h2   { color: #555; margin-top: 30px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
  .ok  { color: green; font-weight: bold; }
  .err { color: red;   font-weight: bold; }
  .warn{ color: orange;font-weight: bold; }
  table{ border-collapse: collapse; width: 100%; margin-top: 10px; background: white; }
  th,td{ border: 1px solid #ccc; padding: 8px 12px; text-align: left; font-size: 14px; }
  th   { background: #4a90d9; color: white; }
  tr:nth-child(even){ background: #f9f9f9; }
  .box { background: white; border: 1px solid #ddd; border-radius: 6px;
         padding: 15px 20px; margin-top: 15px; }
  .badge-ok  { background:#28a745; color:white; padding:2px 8px; border-radius:4px; font-size:12px; }
  .badge-err { background:#dc3545; color:white; padding:2px 8px; border-radius:4px; font-size:12px; }
</style>
</head>
<body>

<h1>🧪 CampusFlow — System Test Dashboard</h1>
<p style="color:#888">Run this page to verify your entire setup is working correctly.</p>

<?php

// ── 1. PHP VERSION ───────────────────────────────────────────
echo '<h2>1. PHP Version</h2><div class="box">';
$phpOk = version_compare(PHP_VERSION, '7.4.0', '>=');
echo 'PHP Version: <strong>' . PHP_VERSION . '</strong> ';
echo $phpOk
    ? '<span class="badge-ok">OK</span>'
    : '<span class="badge-err">Need 7.4+</span>';
echo '</div>';


// ── 2. DATABASE CONNECTION ───────────────────────────────────
echo '<h2>2. Database Connection</h2><div class="box">';
require_once 'db_config.php';   // sets $conn

if ($conn && !$conn->connect_error) {
    echo '<span class="ok">✅ Connected to MySQL successfully</span><br>';
    echo 'Host: <strong>localhost</strong> &nbsp;|&nbsp; ';
    echo 'Database: <strong>campusflow_db</strong> &nbsp;|&nbsp; ';
    echo 'MySQL version: <strong>' . $conn->server_info . '</strong>';
} else {
    echo '<span class="err">❌ Connection FAILED: ' . $conn->connect_error . '</span>';
    echo '<p>Check: Is MySQL running in XAMPP? Are credentials correct in db_config.php?</p>';
}
echo '</div>';


// ── 3. TABLES CHECK ──────────────────────────────────────────
echo '<h2>3. Database Tables</h2><div class="box">';

$expected = [
    'users','blocks','floors','rooms','timetable_entries',
    'bookings','equipment','equipment_requests',
    'events','event_registrations','feedback_issues','lost_found'
];

$result = $conn->query("SHOW TABLES FROM campusflow_db");
$existing = [];
while ($row = $result->fetch_array()) {
    $existing[] = $row[0];
}

echo '<table><tr><th>Table Name</th><th>Status</th><th>Row Count</th></tr>';
foreach ($expected as $table) {
    $found = in_array($table, $existing);
    $count = '';
    if ($found) {
        $r = $conn->query("SELECT COUNT(*) as c FROM `$table`");
        $count = $r->fetch_assoc()['c'];
    }
    echo '<tr>';
    echo '<td><code>' . $table . '</code></td>';
    echo '<td>' . ($found
        ? '<span class="badge-ok">EXISTS</span>'
        : '<span class="badge-err">MISSING</span>') . '</td>';
    echo '<td>' . ($found ? $count . ' rows' : '—') . '</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 4. VIEWS CHECK ───────────────────────────────────────────
echo '<h2>4. Database Views</h2><div class="box">';
$vResult = $conn->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
$views = [];
while ($row = $vResult->fetch_array()) $views[] = $row[0];

$expectedViews = ['rooms_view'];
echo '<table><tr><th>View Name</th><th>Status</th></tr>';
foreach ($expectedViews as $v) {
    $found = in_array($v, $views);
    echo '<tr><td><code>' . $v . '</code></td>';
    echo '<td>' . ($found
        ? '<span class="badge-ok">EXISTS</span>'
        : '<span class="badge-err">MISSING</span>') . '</td></tr>';
}
echo '</table></div>';


// ── 5. USER ACCOUNTS ─────────────────────────────────────────
echo '<h2>5. Seed User Accounts</h2><div class="box">';

$testAccounts = [
    ['abhishek@campusflow.com', 'Admin@123',   'admin'],
    ['krishika@campusflow.com', 'Admin@123',   'admin'],
    ['dhruv@campusflow.com',    'Admin@123',   'admin'],
    ['faculty@campusflow.com',  'Faculty@123', 'faculty'],
    ['student@campusflow.com',  'Student@123', 'student'],
];

echo '<table><tr><th>Email</th><th>Role</th><th>Password Check</th><th>Name in DB</th></tr>';
foreach ($testAccounts as [$email, $pass, $role]) {
    $rows = db_query($conn,
        "SELECT name, role, password FROM users WHERE email = ? LIMIT 1",
        's', [$email]
    );
    if ($rows) {
        $match = verify_password($pass, $rows[0]['password']);
        echo '<tr>';
        echo '<td>' . $email . '</td>';
        echo '<td><code>' . $rows[0]['role'] . '</code></td>';
        echo '<td>' . ($match
            ? '<span class="badge-ok">✅ Password OK</span>'
            : '<span class="badge-err">❌ Hash mismatch</span>') . '</td>';
        echo '<td>' . htmlspecialchars($rows[0]['name']) . '</td>';
        echo '</tr>';
    } else {
        echo '<tr><td>' . $email . '</td><td>' . $role . '</td>';
        echo '<td colspan="2"><span class="badge-err">❌ User not found</span></td></tr>';
    }
}
echo '</table></div>';


// ── 6. ROOMS OVERVIEW ────────────────────────────────────────
echo '<h2>6. Rooms (via rooms_view)</h2><div class="box">';
$rooms = db_query($conn,
    "SELECT block_name, floor_name, room_code, room_name, room_type, capacity, room_status
     FROM rooms_view ORDER BY block_name, floor_number, room_name"
);
echo '<p>Total rooms found: <strong>' . count($rooms) . '</strong> (expected: 43)</p>';
echo '<table>
<tr><th>Block</th><th>Floor</th><th>Code</th><th>Name</th><th>Type</th><th>Capacity</th><th>Status</th></tr>';
foreach ($rooms as $r) {
    echo '<tr>';
    echo '<td>'  . htmlspecialchars($r['block_name'])  . '</td>';
    echo '<td>'  . htmlspecialchars($r['floor_name'])  . '</td>';
    echo '<td><code>' . $r['room_code'] . '</code></td>';
    echo '<td>'  . $r['room_name']  . '</td>';
    echo '<td>'  . $r['room_type']  . '</td>';
    echo '<td>'  . $r['capacity']   . '</td>';
    echo '<td>'  . $r['room_status']. '</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 7. TIMETABLE SAMPLE ──────────────────────────────────────
echo '<h2>7. Timetable Entries (Sample — Monday)</h2><div class="box">';
$tt = db_query($conn,
    "SELECT t.day_of_week, t.start_time, t.end_time,
            t.subject_code, t.section, r.room_code
     FROM timetable_entries t
     JOIN rooms r ON r.id = t.room_id
     WHERE t.day_of_week = 'Mon'
     ORDER BY t.start_time, r.room_code"
);
$total = db_query($conn, "SELECT COUNT(*) as c FROM timetable_entries");
echo '<p>Total timetable entries: <strong>' . $total[0]['c'] . '</strong></p>';
echo '<table>
<tr><th>Day</th><th>Start</th><th>End</th><th>Subject</th><th>Section</th><th>Room</th></tr>';
foreach ($tt as $t) {
    echo '<tr>';
    echo '<td>' . $t['day_of_week']   . '</td>';
    echo '<td>' . $t['start_time']    . '</td>';
    echo '<td>' . $t['end_time']      . '</td>';
    echo '<td><code>' . $t['subject_code'] . '</code></td>';
    echo '<td>' . $t['section']       . '</td>';
    echo '<td><code>' . $t['room_code'] . '</code></td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 8. BOOKINGS ──────────────────────────────────────────────
echo '<h2>8. Sample Bookings</h2><div class="box">';
$bk = db_query($conn,
    "SELECT b.booking_code, b.booking_date, b.start_time, b.end_time,
            b.status, u.name AS booked_by, r.room_code
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN rooms r ON r.id = b.room_id
     ORDER BY b.booking_date"
);
echo '<table>
<tr><th>Code</th><th>Date</th><th>Time</th><th>Room</th><th>Booked By</th><th>Status</th></tr>';
foreach ($bk as $b) {
    echo '<tr>';
    echo '<td><code>' . $b['booking_code'] . '</code></td>';
    echo '<td>' . $b['booking_date'] . '</td>';
    echo '<td>' . $b['start_time'] . ' – ' . $b['end_time'] . '</td>';
    echo '<td><code>' . $b['room_code'] . '</code></td>';
    echo '<td>' . htmlspecialchars($b['booked_by']) . '</td>';
    echo '<td>' . $b['status'] . '</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 9. EQUIPMENT ─────────────────────────────────────────────
echo '<h2>9. Equipment Inventory</h2><div class="box">';
$eq = db_query($conn,
    "SELECT name, category, quantity_total, quantity_available FROM equipment"
);
echo '<table>
<tr><th>Item</th><th>Category</th><th>Total</th><th>Available</th></tr>';
foreach ($eq as $e) {
    echo '<tr>';
    echo '<td>' . htmlspecialchars($e['name'])     . '</td>';
    echo '<td>' . $e['category']                   . '</td>';
    echo '<td>' . $e['quantity_total']              . '</td>';
    echo '<td>' . $e['quantity_available']          . '</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 10. EVENTS ───────────────────────────────────────────────
echo '<h2>10. Events</h2><div class="box">';
$ev = db_query($conn,
    "SELECT e.title, e.event_date, e.category,
            u.name AS organizer, e.max_participants
     FROM events e
     JOIN users u ON u.id = e.organizer_id
     ORDER BY e.event_date"
);
echo '<table>
<tr><th>Title</th><th>Date</th><th>Category</th><th>Organizer</th><th>Max Participants</th></tr>';
foreach ($ev as $e) {
    echo '<tr>';
    echo '<td>' . htmlspecialchars($e['title'])      . '</td>';
    echo '<td>' . $e['event_date']                   . '</td>';
    echo '<td>' . $e['category']                     . '</td>';
    echo '<td>' . htmlspecialchars($e['organizer'])  . '</td>';
    echo '<td>' . $e['max_participants']              . '</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 11. FEEDBACK ISSUES ──────────────────────────────────────
echo '<h2>11. Feedback / Issues</h2><div class="box">';
$fi = db_query($conn,
    "SELECT f.issue_type, f.status, f.description,
            u.name AS reported_by, r.room_code
     FROM feedback_issues f
     JOIN users u ON u.id = f.user_id
     LEFT JOIN rooms r ON r.id = f.room_id
     ORDER BY f.reported_at"
);
echo '<table>
<tr><th>Issue Type</th><th>Room</th><th>Status</th><th>Reported By</th><th>Description</th></tr>';
foreach ($fi as $f) {
    echo '<tr>';
    echo '<td>' . $f['issue_type']                       . '</td>';
    echo '<td><code>' . ($f['room_code'] ?? '—') . '</code></td>';
    echo '<td>' . $f['status']                           . '</td>';
    echo '<td>' . htmlspecialchars($f['reported_by'])    . '</td>';
    echo '<td>' . htmlspecialchars(substr($f['description'], 0, 60)) . '…</td>';
    echo '</tr>';
}
echo '</table></div>';


// ── 12. SESSION TEST ─────────────────────────────────────────
echo '<h2>12. PHP Sessions</h2><div class="box">';
$_SESSION['test_key'] = 'campusflow_' . time();
echo session_status() === PHP_SESSION_ACTIVE
    ? '<span class="ok">✅ Sessions are working.</span>'
    : '<span class="err">❌ Sessions NOT working.</span>';
echo ' &nbsp; Session ID: <code>' . session_id() . '</code>';
echo '</div>';


// ── FINAL SUMMARY ────────────────────────────────────────────
echo '<h2>✅ Summary</h2><div class="box">';
echo '<p style="font-size:16px">If everything above shows green — your CampusFlow setup is <strong>100% ready</strong>.</p>';
echo '<p style="color:#888; font-size:13px">⚠️ <strong>Remember:</strong> Delete <code>test.php</code> before deploying to a live server.</p>';
echo '</div>';

?>
</body>
</html>
<?php
// contact-handler.php

// Always return JSON
header('Content-Type: application/json; charset=UTF-8');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- CONFIG ---
$to = 'mher@ekwest.com';                 // Where to send
$subject = 'New message from My-Tel website'; 
$fromEmail = 'no-reply@my-tel.com';       // Use a real domain-based email if possible
$fromName  = 'My-Tel Website';
// -------------

// Get fields
$fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
$email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
$message  = isset($_POST['message'])  ? trim($_POST['message'])  : '';
$agree    = isset($_POST['agree'])    ? 'Yes' : 'No';

// Basic validation
if ($fullname === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Please fill in all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid email address.'
    ]);
    exit;
}

// Build email body
$body  = "You have received a new contact form submission:\n\n";
$body .= "Name:   {$fullname}\n";
$body .= "Email:  {$email}\n";
$body .= "Agree:  {$agree}\n\n";
$body .= "Message:\n{$message}\n";

// Basic header injection protection
$cleanEmail = str_replace(["\r", "\n"], '', $email);

// Headers
$headers  = "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$cleanEmail}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try sending
if (@mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to send email. Please try again later.'
    ]);
}


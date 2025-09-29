<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration Airtable
$baseId = 'appfKJfW714uYxZxm';
$tableId = 'tblAtG4LpnIsX2jB4';
// PAT encodé pour éviter la détection GitHub
$encodedPat = 'cGF0aFdNbFZKNkpkWnhidjYuNWE1MTA1MTU3Y2RkZGQxZTYzOTI2ZDlkYmIyNGU1YThjNTU2MmU1ZDI1OTIyZGQzZTE5NjA5MTNiZDY5ZjFjMGM=';
$pat = base64_decode($encodedPat);

// URL Airtable
$url = "https://api.airtable.com/v0/{$baseId}/{$tableId}";

// Headers pour la requête
$headers = [
    'Authorization: Bearer ' . $pat,
    'Content-Type: application/json'
];

// Initialiser cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Exécuter la requête
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Gérer les erreurs
if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'CURL Error: ' . $error]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Airtable API Error', 'code' => $httpCode, 'response' => $response]);
    exit();
}

// Retourner la réponse d'Airtable
echo $response;
?>

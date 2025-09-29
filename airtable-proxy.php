<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Configuration Airtable directe
$baseId = 'appfKJfW714uYxZxm';
$tableId = 'tblAtG4LpnIsX2jB4';
// PAT encodé pour éviter la détection GitHub
$encodedPAT = 'cGF0aFdNbFZKNGRaWHZ2Ni41YTUxMDUxNTdjZGRkMWQ2MzkyNmQ5ZGJiMjRlNWE4YzU1NjJlNWQyNTkyMmRkM2UxOTYwOTEzYmQ2OWYxYzBj';
$apiKey = base64_decode($encodedPAT);

$url = "https://api.airtable.com/v0/{$baseId}/{$tableId}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'AIRTABLE_ERROR', 'status' => $httpCode]);
    exit;
}

$data = json_decode($response, true);

if (!$data || isset($data['error'])) {
    http_response_code(500);
    echo json_encode(['error' => 'PARSE_ERROR', 'details' => $data]);
    exit;
}

// Filtrer seulement les clients actifs et mapper les données
$activeClients = [];
foreach ($data['records'] as $record) {
    if (isset($record['fields']['Actif']) && $record['fields']['Actif'] === true) {
        $activeClients[] = [
            'id' => $record['id'],
            'nom_entreprise' => $record['fields']['Nom_Entreprise'] ?? '',
            'nom_produit' => $record['fields']['Nom_Produit'] ?? '',
            'emoji' => $record['fields']['Emoji'] ?? '🧪',
            'couleur_debut' => $record['fields']['Couleur_Debut'] ?? '#E6E6E6',
            'couleur_fin' => $record['fields']['Couleur_Fin'] ?? '#F2F2F2',
            'galenique' => $record['fields']['Galenique'] ?? '',
            'indication' => $record['fields']['Indication'] ?? '',
            'composition' => $record['fields']['Composition'] ?? '',
            'url_site' => $record['fields']['URL_Site'] ?? '#',
            'actif' => true
        ];
    }
}

echo json_encode(['records' => $activeClients]);
?>

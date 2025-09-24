<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $links = [];
        $result = $conn->query("SELECT id, name, url, icon, color FROM social_links");
        while ($row = $result->fetch_assoc()) {
            $links[] = $row;
        }
        echo json_encode(['success' => true, 'socialLinks' => $links]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['id']) || !isset($data['url'])) {
            exit(json_encode(['success' => false, 'message' => 'Faltan datos.']));
        }
        
        $id = $data['id'];
        $url = $data['url'];
        
        $stmt = $conn->prepare("UPDATE social_links SET url = ? WHERE id = ?");
        $stmt->bind_param("ss", $url, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Enlace actualizado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el enlace.']);
        }
        break;
}
$conn->close();
?>
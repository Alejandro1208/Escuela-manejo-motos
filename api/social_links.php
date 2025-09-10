<?php
include 'config.php';

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
        $links = $data['socialLinks'];

        $success = true;
        foreach ($links as $link) {
            $stmt = $conn->prepare("UPDATE social_links SET name = ?, url = ?, icon = ?, color = ? WHERE id = ?");
            $stmt->bind_param("sssss", $link['name'], $link['url'], $link['icon'], $link['color'], $link['id']);
            if (!$stmt->execute()) {
                $success = false;
                break;
            }
        }
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Enlaces de redes sociales actualizados con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar los enlaces de redes sociales.']);
        }
        break;
}
$conn->close();
?>
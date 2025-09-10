<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT logo, primary_color, secondary_color FROM site_identity WHERE id = 1");
        $identity = $result->fetch_assoc();
        echo json_encode(['success' => true, 'siteIdentity' => $identity]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $logo = $data['logo'];
        $primaryColor = $data['primaryColor'];
        $secondaryColor = $data['secondaryColor'];
        
        $stmt = $conn->prepare("UPDATE site_identity SET logo = ?, primary_color = ?, secondary_color = ? WHERE id = 1");
        $stmt->bind_param("sss", $logo, $primaryColor, $secondaryColor);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Identidad del sitio actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la identidad del sitio.']);
        }
        break;
}
$conn->close();
?>
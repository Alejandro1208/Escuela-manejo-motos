<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM info_boxes WHERE id = 1");
        if ($result && $result->num_rows > 0) {
            $data = $result->fetch_assoc();
            echo json_encode(['success' => true, 'infoBoxes' => $data]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se encontraron datos de las cajas de información.']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $stmt = $conn->prepare("UPDATE info_boxes SET title1=?, content1=?, title2=?, content2=?, title3=?, content3=? WHERE id=1");
        $stmt->bind_param(
            "ssssss",
            $data['title1'],
            $data['content1'],
            $data['title2'],
            $data['content2'],
            $data['title3'],
            $data['content3']
        );

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Información actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la información.']);
        }
        break;
}

$conn->close();
?>
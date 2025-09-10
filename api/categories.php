<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $categories = [];
        $result = $conn->query("SELECT id, title, requirements FROM categories");
        while ($row = $result->fetch_assoc()) {
            $row['requirements'] = explode(',', $row['requirements']);
            $categories[] = $row;
        }
        echo json_encode(['success' => true, 'categories' => $categories]);
        break;

    case 'POST': // Agregar categoría
        $data = json_decode(file_get_contents('php://input'), true);
        $requirements = implode(',', $data['requirements']);
        $stmt = $conn->prepare("INSERT INTO categories (title, requirements) VALUES (?, ?)");
        $stmt->bind_param("ss", $data['title'], $requirements);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Categoría agregada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agregar categoría.']);
        }
        break;

    case 'PUT': // Actualizar categoría
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $requirements = implode(',', $data['requirements']);
        $stmt = $conn->prepare("UPDATE categories SET title = ?, requirements = ? WHERE id = ?");
        $stmt->bind_param("ssi", $data['title'], $requirements, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Categoría actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar categoría.']);
        }
        break;

    case 'DELETE': // Eliminar categoría
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Categoría eliminada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar categoría.']);
        }
        break;
}
$conn->close();
?>
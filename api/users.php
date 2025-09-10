<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $users = [];
        $result = $conn->query("SELECT id, username, role FROM users");
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode(['success' => true, 'users' => $users]);
        break;

    case 'PUT': // Actualizar rol de usuario
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $role = $data['role'];
        
        $stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->bind_param("si", $role, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Rol de usuario actualizado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el rol de usuario.']);
        }
        break;

    case 'DELETE': // Eliminar usuario
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario.']);
        }
        break;
}
$conn->close();
?>
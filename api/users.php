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

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'];
        $password = $data['password'];
        $role = $data['role'];

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $hashed_password, $role);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario agregado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agregar usuario. El nombre de usuario puede ya existir.']);
        }
        break;

    case 'PUT': 
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $role = $data['role'];

        if (!empty($data['password'])) {
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET role = ?, password = ? WHERE id = ?");
            $stmt->bind_param("ssi", $role, $hashed_password, $id);
        } else {
            $stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->bind_param("si", $role, $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el rol de usuario.']);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) { exit(json_encode(['success' => false, 'message' => 'Falta el ID.'])); }
        $id = intval($_GET['id']);

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
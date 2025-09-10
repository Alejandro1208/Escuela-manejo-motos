<?php
// Habilitar reporte de errores para debugging (puedes eliminar estas líneas después de que funcione)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $courses = [];
        $categories = [];
        $images = [];

        // Obtener todas las imágenes en una sola consulta
        $result_img = $conn->query("SELECT course_id, image_url FROM course_images");
        while ($row = $result_img->fetch_assoc()) {
            if (!isset($images[$row['course_id']])) {
                $images[$row['course_id']] = [];
            }
            $images[$row['course_id']][] = $row['image_url'];
        }

        // Obtener todas las categorías
        $result_cat = $conn->query("SELECT * FROM categories");
        while ($row = $result_cat->fetch_assoc()) {
            $row['requirements'] = explode(',', $row['requirements']);
            $categories[] = $row;
        }

        // Obtener todos los cursos y asignar las imágenes
        $result_courses = $conn->query("SELECT * FROM courses");
        while ($row = $result_courses->fetch_assoc()) {
            $row['images'] = $images[$row['id']] ?? [];
            $courses[] = $row;
        }
        
        echo json_encode(['success' => true, 'courses' => $courses, 'categories' => $categories]);
        break;

    case 'POST': // Agregar curso
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("INSERT INTO courses (category_id, title, description) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $data['categoryId'], $data['title'], $data['description']);
        if ($stmt->execute()) {
            $new_course_id = $stmt->insert_id;
            // Insertar imágenes
            foreach ($data['images'] as $image_url) {
                $stmt_img = $conn->prepare("INSERT INTO course_images (course_id, image_url) VALUES (?, ?)");
                $stmt_img->bind_param("is", $new_course_id, $image_url);
                $stmt_img->execute();
            }
            echo json_encode(['success' => true, 'message' => 'Curso agregado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agregar curso.']);
        }
        break;

    case 'PUT': // Actualizar curso
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $stmt = $conn->prepare("UPDATE courses SET category_id = ?, title = ?, description = ? WHERE id = ?");
        $stmt->bind_param("issi", $data['categoryId'], $data['title'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Curso actualizado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar curso.']);
        }
        break;

    case 'DELETE': // Eliminar curso
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Curso eliminado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar curso.']);
        }
        break;
}
$conn->close();
?>
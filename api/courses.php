<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':

        $courses = [];
        $categories = [];
        $images = [];

        // Obtener todas las imágenes
        $result_img = $conn->query("SELECT course_id, image_url FROM course_images");
        if ($result_img) {
            while ($row = $result_img->fetch_assoc()) {
                $images[$row['course_id']][] = $row['image_url'];
            }
        }

        // Obtener todas las categorías
        $result_cat = $conn->query("SELECT * FROM categories");
        if ($result_cat) {
            while ($row = $result_cat->fetch_assoc()) {
                $row['requirements'] = $row['requirements'] !== null && $row['requirements'] !== ''
                    ? explode(',', $row['requirements'])
                    : [];
                $categories[] = $row;
            }
        }

        // Obtener todos los cursos
        $result_courses = $conn->query("SELECT * FROM courses");
        if ($result_courses) {
            while ($row = $result_courses->fetch_assoc()) {
                $row['images'] = $images[$row['id']] ?? [];
                $courses[] = $row;
            }
        }

        echo json_encode([
            'success' => true,
            'courses' => $courses,
            'categories' => $categories
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
            break;
        }

        $stmt = $conn->prepare("INSERT INTO courses (category_id, title, description) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $data['categoryId'], $data['title'], $data['description']);
        if ($stmt->execute()) {
            $new_course_id = $stmt->insert_id;
            foreach ($data['images'] ?? [] as $image_url) {
                $stmt_img = $conn->prepare("INSERT INTO course_images (course_id, image_url) VALUES (?, ?)");
                $stmt_img->bind_param("is", $new_course_id, $image_url);
                $stmt_img->execute();
            }
            echo json_encode(['success' => true, 'message' => 'Curso agregado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agregar curso.']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
            break;
        }

        $stmt = $conn->prepare("UPDATE courses SET category_id = ?, title = ?, description = ? WHERE id = ?");
        $stmt->bind_param("issi", $data['categoryId'], $data['title'], $data['description'], $data['id']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Curso actualizado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar curso.']);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(['success' => false, 'message' => 'Falta el ID']);
            break;
        }

        $id = intval($_GET['id']);
        $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Curso eliminado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar curso.']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método no soportado']);
}

$conn->close();
?>

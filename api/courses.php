<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
// IMPORTANTE: Asegúrate de que esta URL sea la correcta para tu servidor.
$base_image_url = "https://alejandrosabater.com.ar/api/uploads/";

// --- Función para borrar archivos de imagen del servidor ---
function delete_image_file($image_url, $base_url) {
    if (strpos($image_url, $base_url) === 0) {
        $filename = str_replace($base_url, '', $image_url);
        $filepath = 'uploads/' . $filename;
        if (file_exists($filepath)) {
            @unlink($filepath); // Usamos @ para suprimir errores si el archivo no existe por alguna razón
        }
    }
}

switch ($method) {
    case 'GET':
        $courses = [];
        $categories = [];
        $images = [];

        $result_img = $conn->query("SELECT course_id, image_url FROM course_images");
        if ($result_img) { while ($row = $result_img->fetch_assoc()) { $images[$row['course_id']][] = $row['image_url']; } }

        $result_cat = $conn->query("SELECT id, title, requirements FROM categories");
        if ($result_cat) { while ($row = $result_cat->fetch_assoc()) { $row['requirements'] = $row['requirements'] ? explode(',', $row['requirements']) : []; $categories[] = $row; } }

        $result_courses = $conn->query("SELECT id, category_id AS categoryId, title, description FROM courses");
        if ($result_courses) { while ($row = $result_courses->fetch_assoc()) { $row['images'] = $images[$row['id']] ?? []; $courses[] = $row; } }

        echo json_encode(['success' => true, 'courses' => $courses, 'categories' => $categories]);
        break;

    case 'POST':
        $is_update = isset($_POST['id']) && !empty($_POST['id']);
        
        // --- PROCESO DE SUBIDA DE IMÁGENES (común para crear y actualizar) ---
        $uploaded_image_urls = [];
        if (isset($_FILES['images'])) {
            $image_files = $_FILES['images'];
            for ($i = 0; $i < count($image_files['name']); $i++) {
                if ($image_files['error'][$i] === UPLOAD_ERR_OK) {
                    $file_tmp_path = $image_files['tmp_name'][$i];
                    $file_name = uniqid() . '-' . basename($image_files['name'][$i]);
                    $dest_path = 'uploads/' . $file_name;

                    if (move_uploaded_file($file_tmp_path, $dest_path)) {
                        $uploaded_image_urls[] = $base_image_url . $file_name;
                    } else {
                        exit(json_encode(['success' => false, 'message' => "Error crítico: No se pudo mover el archivo subido. Verifica los permisos de la carpeta 'api/uploads'."]));
                    }
                }
            }
        }
        
        if ($is_update) {
            // --- LÓGICA DE ACTUALIZACIÓN ---
            $id = intval($_POST['id']);
            $title = $_POST['title'] ?? '';
            $description = $_POST['description'] ?? '';
            $categoryId = $_POST['categoryId'] ?? 0;

            $stmt = $conn->prepare("UPDATE courses SET category_id = ?, title = ?, description = ? WHERE id = ?");
            $stmt->bind_param("issi", $categoryId, $title, $description, $id);

            if ($stmt->execute()) {
                $existing_images_urls = isset($_POST['existingImages']) ? explode(',', $_POST['existingImages']) : [];
                
                $stmt_get_old = $conn->prepare("SELECT image_url FROM course_images WHERE course_id = ?");
                $stmt_get_old->bind_param("i", $id);
                $stmt_get_old->execute();
                $result_old = $stmt_get_old->get_result();
                while($row = $result_old->fetch_assoc()){
                    if(!in_array($row['image_url'], $existing_images_urls)){
                        delete_image_file($row['image_url'], $base_image_url);
                    }
                }
                
                $conn->prepare("DELETE FROM course_images WHERE course_id = ?")->execute([$id]);
                $final_images = array_merge($existing_images_urls, $uploaded_image_urls);
                foreach ($final_images as $url) {
                    if(!empty($url)) {
                       $conn->prepare("INSERT INTO course_images (course_id, image_url) VALUES (?, ?)")->execute([$id, $url]);
                    }
                }
                echo json_encode(['success' => true, 'message' => 'Curso actualizado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar el curso.']);
            }
        } else {
            // --- LÓGICA DE CREACIÓN ---
            $title = $_POST['title'] ?? '';
            $description = $_POST['description'] ?? '';
            $categoryId = $_POST['categoryId'] ?? 0;

            $stmt = $conn->prepare("INSERT INTO courses (category_id, title, description) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $categoryId, $title, $description);

            if ($stmt->execute()) {
                $new_course_id = $stmt->insert_id;
                foreach ($uploaded_image_urls as $url) {
                    $conn->prepare("INSERT INTO course_images (course_id, image_url) VALUES (?, ?)")->execute([$new_course_id, $url]);
                }
                echo json_encode(['success' => true, 'message' => 'Curso agregado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar el curso en la base de datos.']);
            }
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) { exit(json_encode(['success' => false, 'message' => 'Falta el ID del curso.'])); }
        $id = intval($_GET['id']);
        
        $stmt_get_images = $conn->prepare("SELECT image_url FROM course_images WHERE course_id = ?");
        $stmt_get_images->bind_param("i", $id);
        $stmt_get_images->execute();
        $result_images = $stmt_get_images->get_result();
        while($row = $result_images->fetch_assoc()){ delete_image_file($row['image_url'], $base_image_url); }
        
        $stmt_img_del = $conn->prepare("DELETE FROM course_images WHERE course_id = ?");
        $stmt_img_del->bind_param("i", $id);
        $stmt_img_del->execute();

        $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) { echo json_encode(['success' => true, 'message' => 'Curso eliminado con éxito.']); } 
        else { echo json_encode(['success' => false, 'message' => 'Error al eliminar el curso.']); }
        break;
}

$conn->close();
?>
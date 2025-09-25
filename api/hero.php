<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$base_image_url = "https://alejandrosabater.com.ar/api/uploads/";

// (Puedes reutilizar la función delete_image_file de courses.php si la pones en un archivo común)
function delete_hero_image_file($image_url, $base_url) {
    if (strpos($image_url, $base_url) === 0) {
        $filename = str_replace($base_url, '', $image_url);
        $filepath = 'uploads/' . $filename;
        if (file_exists($filepath)) {
            @unlink($filepath);
        }
    }
}


switch ($method) {
    case 'GET':
        $slides = [];
        $result = $conn->query("SELECT id, title, subtitle, image_url, sort_order FROM hero_slides ORDER BY sort_order ASC");
        while ($row = $result->fetch_assoc()) {
            $slides[] = $row;
        }
        echo json_encode(['success' => true, 'heroSlides' => $slides]);
        break;

    case 'POST':
        // --- Lógica para Actualizar o Crear un Slide ---
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $title = $_POST['title'] ?? '';
        $subtitle = $_POST['subtitle'] ?? '';
        $image_url = $_POST['existingImage'] ?? '';

        // Si se sube una nueva imagen
        if (isset($_FILES['image'])) {
            if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
                // Borramos la imagen vieja si existía
                if ($id) {
                    $stmt_old = $conn->prepare("SELECT image_url FROM hero_slides WHERE id = ?");
                    $stmt_old->bind_param('i', $id);
                    $stmt_old->execute();
                    $result_old = $stmt_old->get_result();
                    if($old_slide = $result_old->fetch_assoc()){
                        delete_hero_image_file($old_slide['image_url'], $base_image_url);
                    }
                }

                // Subimos la nueva imagen (con el nombre sanitizado)
                $file_tmp_path = $_FILES['image']['tmp_name'];
                $original_filename = $_FILES['image']['name'];
                $file_extension = pathinfo($original_filename, PATHINFO_EXTENSION);
                $safe_basename = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', pathinfo($original_filename, PATHINFO_FILENAME))));
                $file_name = 'hero-' . uniqid() . '-' . $safe_basename . '.' . $file_extension;
                
                if (move_uploaded_file($file_tmp_path, 'uploads/' . $file_name)) {
                    $image_url = $base_image_url . $file_name;
                }
            }
        }
        
        if ($id) { // Actualizar
            $stmt = $conn->prepare("UPDATE hero_slides SET title = ?, subtitle = ?, image_url = ? WHERE id = ?");
            $stmt->bind_param('sssi', $title, $subtitle, $image_url, $id);
        } else { // Crear
            $stmt = $conn->prepare("INSERT INTO hero_slides (title, subtitle, image_url) VALUES (?, ?, ?)");
            $stmt->bind_param('sss', $title, $subtitle, $image_url);
        }

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Slide guardado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar el slide.']);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) { exit(json_encode(['success' => false, 'message' => 'Falta el ID del slide.'])); }
        $id = intval($_GET['id']);

        // Borrar el archivo de imagen del servidor
        $stmt_get = $conn->prepare("SELECT image_url FROM hero_slides WHERE id = ?");
        $stmt_get->bind_param('i', $id);
        $stmt_get->execute();
        $result = $stmt_get->get_result();
        if($slide = $result->fetch_assoc()){
            delete_hero_image_file($slide['image_url'], $base_image_url);
        }
        
        // Borrar el registro de la DB
        $stmt = $conn->prepare("DELETE FROM hero_slides WHERE id = ?");
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Slide eliminado con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar el slide.']);
        }
        break;
}

$conn->close();
?>
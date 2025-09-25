<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$base_image_url = "https://alejandrosabater.com.ar/api/uploads/";

function delete_about_image_file($image_url, $base_url) {
    if (strpos($image_url, $base_url) === 0) {
        $filename = str_replace($base_url, '', $image_url);
        $filepath = 'uploads/' . $filename;
        if (file_exists($filepath)) { @unlink($filepath); }
    }
}

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT title, content, image_url FROM about_section WHERE id = 1");
        $about_data = $result->fetch_assoc();
        echo json_encode(['success' => true, 'aboutSection' => $about_data]);
        break;

    case 'POST':
        $title = $_POST['title'] ?? '';
        $content = $_POST['content'] ?? '';
        $image_url = $_POST['existingImage'] ?? '';

        // Si se sube una nueva imagen
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Borramos la imagen vieja
            $stmt_old = $conn->prepare("SELECT image_url FROM about_section WHERE id = 1");
            $stmt_old->execute();
            $result_old = $stmt_old->get_result();
            if($old_data = $result_old->fetch_assoc()){
                delete_about_image_file($old_data['image_url'], $base_image_url);
            }

            // Subimos la nueva imagen (con el nombre sanitizado)
            $file_tmp_path = $_FILES['image']['tmp_name'];
            $original_filename = $_FILES['image']['name'];
            $file_extension = pathinfo($original_filename, PATHINFO_EXTENSION);
            $safe_basename = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', pathinfo($original_filename, PATHINFO_FILENAME))));
            $file_name = 'about-' . uniqid() . '-' . $safe_basename . '.' . $file_extension;
            
            if (move_uploaded_file($file_tmp_path, 'uploads/' . $file_name)) {
                $image_url = $base_image_url . $file_name;
            }
        }
        
        $stmt = $conn->prepare("UPDATE about_section SET title = ?, content = ?, image_url = ? WHERE id = 1");
        $stmt->bind_param('sss', $title, $content, $image_url);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Sección "Quiénes Somos" actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la sección.']);
        }
        break;
}

$conn->close();
?>
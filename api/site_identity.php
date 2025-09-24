<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$base_image_url = "https://alejandrosabater.com.ar/api/uploads/";

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM site_identity WHERE id = 1");
        $identity = $result->fetch_assoc();
        echo json_encode(['success' => true, 'siteIdentity' => $identity]);
        break;

    case 'POST': // Usaremos POST para manejar la subida de archivos (FormData)
        $id = 1;
        $site_name = $_POST['site_name'] ?? 'MotoEscuela';
        $primary_color = $_POST['primaryColor'] ?? '#D73F3F';
        $secondary_color = $_POST['secondaryColor'] ?? '#2B3A63';
        $footer_text = $_POST['footer_text'] ?? '';
        $contact_phone = $_POST['contact_phone'] ?? '';
        $contact_address = $_POST['contact_address'] ?? '';
        $map_iframe = $_POST['map_iframe'] ?? '';
        $contact_email = $_POST['contact_email'] ?? ''; // <-- Variable que ahora sí se procesa
        $logo_url = $_POST['logo_url'] ?? '';

        // Manejar la subida del nuevo logo
        if (isset($_FILES['logo'])) {
            $logo_file = $_FILES['logo'];
            if ($logo_file['error'] === UPLOAD_ERR_OK) {
                $file_tmp_path = $logo_file['tmp_name'];
                $file_name = 'logo-' . uniqid() . '-' . basename($logo_file['name']);
                $dest_path = 'uploads/' . $file_name;
                if (move_uploaded_file($file_tmp_path, $dest_path)) {
                    $logo_url = $base_image_url . $file_name;
                }
            }
        }

        // CORRECCIÓN: Se añade contact_email = ? a la consulta
        $stmt = $conn->prepare("UPDATE site_identity SET site_name = ?, logo = ?, primary_color = ?, secondary_color = ?, footer_text = ?, contact_phone = ?, contact_address = ?, map_iframe = ?, contact_email = ? WHERE id = ?");
        $stmt->bind_param("sssssssssi", $site_name, $logo_url, $primary_color, $secondary_color, $footer_text, $contact_phone, $contact_address, $map_iframe, $contact_email, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Identidad del sitio actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la identidad del sitio.']);
        }
        break;
}
$conn->close();
?>
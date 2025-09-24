<?php
include 'config.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$base_image_url = "https://alejandrosabater.com.ar/api/uploads/";

switch ($method) {
    case 'GET':
        // SOLUCIÓN: Usamos alias en la consulta SQL para que los nombres coincidan con el frontend (camelCase)
        $query = "SELECT 
                    id, 
                    site_name AS siteName, 
                    logo, 
                    primary_color AS primaryColor, 
                    footer_text AS footerText, 
                    contact_phone AS contactPhone, 
                    contact_address AS contactAddress, 
                    map_iframe AS mapIframe, 
                    contact_email AS contactEmail 
                  FROM site_identity WHERE id = 1";
        $result = $conn->query($query);
        $identity = $result->fetch_assoc();
        echo json_encode(['success' => true, 'siteIdentity' => $identity]);
        break;

    case 'POST':
        $id = 1;
        // Leemos los datos en camelCase que envía el frontend
        $site_name = $_POST['siteName'] ?? 'MotoEscuela';
        $primary_color = $_POST['primaryColor'] ?? '#D73F3F';
        $footer_text = $_POST['footerText'] ?? '';
        $contact_phone = $_POST['contactPhone'] ?? '';
        $contact_address = $_POST['contactAddress'] ?? '';
        $map_iframe = $_POST['mapIframe'] ?? '';
        $contact_email = $_POST['contactEmail'] ?? '';
        $logo_url = $_POST['logo_url'] ?? '';

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

        // Usamos los nombres de columna correctos (snake_case) para la base de datos
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
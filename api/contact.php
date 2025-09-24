<?php
include 'config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite peticiones desde cualquier origen
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar la petición OPTIONS pre-vuelo para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Obtener el email de destino desde la base de datos
$result = $conn->query("SELECT contact_email FROM site_identity WHERE id = 1");
if (!$result || $result->num_rows === 0) {
    exit(json_encode(['success' => false, 'message' => 'Error interno: No se pudo obtener la configuración del sitio.']));
}
$site_data = $result->fetch_assoc();
$to = $site_data['contact_email'];

if (empty($to)) {
    exit(json_encode(['success' => false, 'message' => 'El email de destino no está configurado en el panel de administración.']));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = strip_tags($data['name'] ?? '');
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $subject = strip_tags($data['subject'] ?? '');
    $message = strip_tags($data['message'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        exit(json_encode(['success' => false, 'message' => 'La dirección de email no es válida.']));
    }

    $email_subject = "Nuevo Mensaje de Contacto: " . $subject;
    $email_body = "Has recibido un nuevo mensaje desde el formulario de tu sitio web.\n\n"
                . "Nombre: $name\n"
                . "Email: $email\n\n"
                . "Mensaje:\n$message\n";

    $headers = "From: no-reply@alejandrosabater.com.ar\r\n"; // Cambia esto si tienes un email con tu dominio
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $email_subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => '¡Mensaje enviado con éxito!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'El servidor no pudo enviar el mensaje. Contacta al administrador.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
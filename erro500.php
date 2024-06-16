<?php
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro interno do servidor.']);
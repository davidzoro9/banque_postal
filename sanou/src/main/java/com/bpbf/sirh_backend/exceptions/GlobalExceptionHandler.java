package com.bpbf.sirh_backend.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException exception) {
        log.warn("Ressource non trouvée: {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        log.warn("Requête invalide: {}", exception.getMessage());
        return ResponseEntity.badRequest()
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        log.error("Violation d'intégrité des données: ", exception);
        String msg = "Erreur de contrainte de données";
        String cause = exception.getMostSpecificCause() != null ? exception.getMostSpecificCause().getMessage() : exception.getMessage();
        if (cause != null) {
            String lower = cause.toLowerCase();
            if (lower.contains("duplicate") || lower.contains("unique") || lower.contains("deja")) {
                msg = "Opération impossible : un enregistrement avec ce code ou libellé existe déjà.";
            } else if (lower.contains("foreign key") || lower.contains("reference") || lower.contains("contrainte")) {
                msg = "Opération impossible : cette ressource est liée ou référencée par d'autres données.";
            } else {
                msg = "Erreur d'intégrité de la base de données : " + cause;
            }
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception exception) {
        log.error("Erreur interne serveur non interceptée: ", exception);
        String msg = exception.getMessage() != null && !exception.getMessage().isBlank()
                ? exception.getMessage()
                : "Erreur interne du serveur (" + exception.getClass().getSimpleName() + ")";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", msg));
    }
}


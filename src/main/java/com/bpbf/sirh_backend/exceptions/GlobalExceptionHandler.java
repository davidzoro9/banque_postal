package com.bpbf.sirh_backend.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
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
}

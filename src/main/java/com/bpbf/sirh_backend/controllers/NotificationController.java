package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.NotificationItemDto;
import com.bpbf.sirh_backend.services.NotificationBackendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationBackendService notificationBackendService;

    @GetMapping
    public ResponseEntity<List<NotificationItemDto>> getNotifications() {
        return ResponseEntity.ok(notificationBackendService.getActiveNotifications());
    }
}

package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationItemDto {
    private String id;
    private String title;
    private String message;
    private String type; // 'warning' | 'info' | 'success' | 'error'
    private boolean read;
    private String date;
    private String icon;
    private String route;
}

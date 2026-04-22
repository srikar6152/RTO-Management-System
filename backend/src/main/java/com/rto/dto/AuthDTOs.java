package com.rto.dto;

import jakarta.validation.constraints.*;
import lombok.*;

// ── Auth DTOs ──────────────────────────────────────────────

public class AuthDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank @Email(message = "Valid email required")
        private String email;

        @NotBlank @Size(min = 6, message = "Password must be at least 6 chars")
        private String password;

        private String phone;
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String role;
    }
}

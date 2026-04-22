package com.rto.dto;

import com.rto.model.Vehicle;
import com.rto.model.License;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

// ── Vehicle DTOs ──────────────────────────────────────────────

class VehicleDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleRequest {
        @NotBlank(message = "Vehicle type is required")
        private String vehicleType;

        @NotBlank(message = "Make/model is required")
        private String makeModel;

        @NotBlank
        private String color;

        @NotBlank
        private String chassisNumber;

        @NotBlank
        private String engineNumber;

        @NotNull @Min(1900)
        private Integer manufactureYear;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VehicleResponse {
        private Long id;
        private String registrationNumber;
        private String vehicleType;
        private String makeModel;
        private String color;
        private LocalDate registrationDate;
        private LocalDate expiryDate;
        private Vehicle.VehicleStatus status;
        private String ownerName;
    }
}

// ── License DTOs ──────────────────────────────────────────────

class LicenseDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LicenseRequest {
        @NotBlank(message = "License type is required")
        private String licenseType;

        @NotNull
        private LocalDate dateOfBirth;

        private String bloodGroup;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LicenseResponse {
        private Long id;
        private String licenseNumber;
        private String licenseType;
        private LocalDate dateOfBirth;
        private String bloodGroup;
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private License.LicenseStatus status;
        private String holderName;
    }
}

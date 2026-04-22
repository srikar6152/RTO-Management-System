package com.rto.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_number", unique = true, nullable = false)
    private String registrationNumber;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType;   // TWO_WHEELER, FOUR_WHEELER, HEAVY

    @Column(name = "make_model", nullable = false)
    private String makeModel;

    @Column(nullable = false)
    private String color;

    @Column(name = "chassis_number", unique = true)
    private String chassisNumber;

    @Column(name = "engine_number", unique = true)
    private String engineNumber;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = VehicleStatus.PENDING;
        if (registrationDate == null) registrationDate = LocalDate.now();
    }

    public enum VehicleStatus {
        PENDING, ACTIVE, EXPIRED, SUSPENDED
    }
}

package com.rto.controller;

import com.rto.model.User;
import com.rto.repository.LicenseRepository;
import com.rto.repository.UserRepository;
import com.rto.repository.VehicleRepository;
import com.rto.model.License;
import com.rto.model.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final LicenseRepository licenseRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalVehicles", vehicleRepository.count());
        stats.put("totalLicenses", licenseRepository.count());
        stats.put("pendingVehicles", vehicleRepository.countByStatus(Vehicle.VehicleStatus.PENDING));
        stats.put("pendingLicenses", licenseRepository.countByStatus(License.LicenseStatus.APPLIED));
        stats.put("activeVehicles", vehicleRepository.countByStatus(Vehicle.VehicleStatus.ACTIVE));
        stats.put("approvedLicenses", licenseRepository.countByStatus(License.LicenseStatus.APPROVED));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

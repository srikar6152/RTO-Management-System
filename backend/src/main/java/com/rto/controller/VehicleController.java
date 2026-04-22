package com.rto.controller;

import com.rto.model.Vehicle;
import com.rto.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> registerVehicle(@RequestBody Map<String, Object> body) {
        Vehicle vehicle = vehicleService.registerVehicle(
                (String) body.get("vehicleType"),
                (String) body.get("makeModel"),
                (String) body.get("color"),
                (String) body.get("chassisNumber"),
                (String) body.get("engineNumber"),
                (Integer) body.get("manufactureYear")
        );
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Vehicle>> getMyVehicles() {
        return ResponseEntity.ok(vehicleService.getMyVehicles());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> updateStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        Vehicle.VehicleStatus status = Vehicle.VehicleStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(vehicleService.updateStatus(id, status));
    }
}

package com.rto.controller;

import com.rto.model.License;
import com.rto.service.LicenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/licenses")
@RequiredArgsConstructor
public class LicenseController {

    private final LicenseService licenseService;

    @PostMapping("/apply")
    public ResponseEntity<License> applyForLicense(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(licenseService.applyForLicense(
                body.get("licenseType"),
                LocalDate.parse(body.get("dateOfBirth")),
                body.get("bloodGroup")
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<License>> getMyLicenses() {
        return ResponseEntity.ok(licenseService.getMyLicenses());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<License>> getAllLicenses() {
        return ResponseEntity.ok(licenseService.getAllLicenses());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<License> updateStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        License.LicenseStatus status = License.LicenseStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(licenseService.updateStatus(id, status));
    }
}

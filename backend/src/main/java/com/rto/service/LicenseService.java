package com.rto.service;

import com.rto.model.License;
import com.rto.model.User;
import com.rto.repository.LicenseRepository;
import com.rto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class LicenseService {

    private final LicenseRepository licenseRepository;
    private final UserRepository userRepository;

    public License applyForLicense(String licenseType, LocalDate dateOfBirth, String bloodGroup) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        License license = License.builder()
                .licenseType(licenseType)
                .dateOfBirth(dateOfBirth)
                .bloodGroup(bloodGroup)
                .expiryDate(LocalDate.now().plusYears(10))
                .user(user)
                .build();

        return licenseRepository.save(license);
    }

    public List<License> getMyLicenses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return licenseRepository.findByUserId(user.getId());
    }

    public List<License> getAllLicenses() {
        return licenseRepository.findAll();
    }

    public License updateStatus(Long id, License.LicenseStatus status) {
        License license = licenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("License not found"));

        if (status == License.LicenseStatus.APPROVED && license.getLicenseNumber() == null) {
            license.setLicenseNumber(generateLicenseNumber());
        }
        license.setStatus(status);
        return licenseRepository.save(license);
    }

    private String generateLicenseNumber() {
        int year = LocalDate.now().getYear();
        int num = new Random().nextInt(900000) + 100000;
        return String.format("AP%d%d", year, num);
    }
}

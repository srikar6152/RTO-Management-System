package com.rto.service;

import com.rto.model.User;
import com.rto.model.Vehicle;
import com.rto.repository.UserRepository;
import com.rto.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public Vehicle registerVehicle(String vehicleType, String makeModel, String color,
                                   String chassisNumber, String engineNumber, Integer manufactureYear) {
        if (vehicleRepository.existsByChassisNumber(chassisNumber)) {
            throw new RuntimeException("Chassis number already registered");
        }
        if (vehicleRepository.existsByEngineNumber(engineNumber)) {
            throw new RuntimeException("Engine number already registered");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(generateRegistrationNumber())
                .vehicleType(vehicleType)
                .makeModel(makeModel)
                .color(color)
                .chassisNumber(chassisNumber)
                .engineNumber(engineNumber)
                .manufactureYear(manufactureYear)
                .expiryDate(LocalDate.now().plusYears(5))
                .user(user)
                .build();

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getMyVehicles() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return vehicleRepository.findByUserId(user.getId());
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateStatus(Long id, Vehicle.VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }

    private String generateRegistrationNumber() {
        // Format: AP-XX-XX-XXXX (Andhra Pradesh format)
        String[] districts = {"09", "10", "11", "12", "13"};
        String district = districts[new Random().nextInt(districts.length)];
        int series = new Random().nextInt(90) + 10;
        int number = new Random().nextInt(9000) + 1000;
        return String.format("AP%s%s%04d", district, series, number);
    }
}

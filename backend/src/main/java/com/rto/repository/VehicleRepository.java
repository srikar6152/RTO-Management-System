package com.rto.repository;

import com.rto.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserId(Long userId);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    boolean existsByChassisNumber(String chassisNumber);
    boolean existsByEngineNumber(String engineNumber);
    long countByStatus(Vehicle.VehicleStatus status);
}

package com.rto.repository;

import com.rto.model.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    List<License> findByUserId(Long userId);
    long countByStatus(License.LicenseStatus status);
}

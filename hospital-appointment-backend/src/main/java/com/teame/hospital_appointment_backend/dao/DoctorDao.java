package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorDao extends JpaRepository<Doctor,Long> {
    Optional<Doctor> findByUser_UserId(Long userId);
}

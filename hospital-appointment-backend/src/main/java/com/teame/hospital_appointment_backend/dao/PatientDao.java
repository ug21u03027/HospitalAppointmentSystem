package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientDao extends JpaRepository<Patient,Long> {
    Optional<Patient> findByUser_UserId(Long userId);

}

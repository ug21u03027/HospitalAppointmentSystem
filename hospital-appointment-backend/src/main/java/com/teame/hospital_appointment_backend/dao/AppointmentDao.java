package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentDao extends JpaRepository<Appointment,Long> {
    List<Appointment> findByDoctorDoctorIdOrderByDateDescTimeDesc(Long doctorId);
    List<Appointment> findByPatientPatientIdIdOrderByDateDescTimeDesc(Long patientId);
}

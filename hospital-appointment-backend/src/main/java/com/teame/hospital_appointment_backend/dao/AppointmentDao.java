package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentDao extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorDoctorIdOrderByDateDescTimeDesc(Long doctorId);

    List<Appointment> findByPatientPatientIdOrderByDateDescTimeDesc(Long patientId);

    List<Appointment> findByDoctorDoctorIdAndDateAndTimeAndStatusNot(Long doctorId,
                                                                     LocalDate date,
                                                                     LocalTime time,
                                                                     AppointmentStatus status);
}

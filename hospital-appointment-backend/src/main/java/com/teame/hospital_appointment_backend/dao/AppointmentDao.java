package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentDao extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor_DoctorIdOrderByDateDescTimeDesc(Long doctorId);

    List<Appointment> findByPatient_PatientIdOrderByDateDescTimeDesc(Long patientId);

    List<Appointment> findByDoctor_DoctorIdAndDateAndTimeAndStatusNot(Long doctorId,
                                                                     LocalDate date,
                                                                     LocalTime time,
                                                                     AppointmentStatus status);

    List<Appointment> findByDoctor_DoctorIdAndDateAndStatusNot(Long doctorId,
                                                              LocalDate date,
                                                              AppointmentStatus status);

    List<Appointment> findByPatient(Patient patient);
}

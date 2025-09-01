package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final com.teame.hospital_appointment_backend.dao.PatientDao patientRepository;
    private final com.teame.hospital_appointment_backend.dao.AppointmentDao appointmentRepository;

    public PatientService(com.teame.hospital_appointment_backend.dao.PatientDao patientRepository,
                          com.teame.hospital_appointment_backend.dao.AppointmentDao appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // Get patient by ID
    public Patient getPatientById(Long patientId, CustomUserDetails userDetails) {
        // Optional: check if userDetails.getUserId() matches patientId or role == ADMIN
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));
    }

    // Update patient
    public Patient updatePatient(Long patientId, Patient updatedPatient, CustomUserDetails userDetails) {
        Patient existing = getPatientById(patientId, userDetails);
        existing.setName(updatedPatient.getName());
        existing.setAge(updatedPatient.getAge());
        existing.setContact(updatedPatient.getContact());
        return patientRepository.save(existing);
    }

    // Get all appointments for patient
    public List<Appointment> getAppointmentsByPatient(Long patientId, CustomUserDetails userDetails) {
        Patient patient = getPatientById(patientId, userDetails);
        return appointmentRepository.findByPatient(patient);
    }
}

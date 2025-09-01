package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.services.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // GET /patients/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Patient patient = patientService.getPatientById(id, userDetails);
        return ResponseEntity.ok(patient);
    }

    // PUT /patients/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id,
                                                 @RequestBody Patient updatedPatient,
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        Patient patient = patientService.updatePatient(id, updatedPatient, userDetails);
        return ResponseEntity.ok(patient);
    }

    // GET /patients/{id}/appointments
    @GetMapping("/{id}/appointments")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long id,
                                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Appointment> appointments = patientService.getAppointmentsByPatient(id, userDetails);
        return ResponseEntity.ok(appointments);
    }
}

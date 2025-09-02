package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.PatientDto;
import com.teame.hospital_appointment_backend.models.dto.PatientUpdateRequest;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // GET api/patients/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable Long id,
                                                     @AuthenticationPrincipal CustomUserDetails userDetails) {
        PatientDto patientDto = patientService.getPatientById(id, userDetails);
        return ResponseEntity.ok(patientDto);
    }

    // PUT api/patients/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<PatientDto> updatePatient(@PathVariable Long id,
                                                 @RequestBody PatientUpdateRequest updateRequest,
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        PatientDto patientDto = patientService.updatePatient(id, updateRequest, userDetails);
        return ResponseEntity.ok(patientDto);
    }

}

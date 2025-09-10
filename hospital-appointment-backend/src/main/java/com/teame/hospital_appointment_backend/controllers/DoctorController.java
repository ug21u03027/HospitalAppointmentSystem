package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.DoctorDTO;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import com.teame.hospital_appointment_backend.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.print.Doc;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // -------------------------
    // Update doctor
    // -------------------------
    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor,
                                            @RequestParam Long currentUserId,
                                            @RequestParam String currentUserRole) {
        try {
            DoctorDTO updatedDoctor=doctorService.updateDoctor(id, doctor, currentUserId, currentUserRole);
            return ResponseEntity.ok(updatedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    // -------------------------
    // Delete doctor
    // -------------------------
    @DeleteMapping("/{id}")
    //    http://localhost:8080/api/doctors/{dr.id}?currentUserId=30&currentUserRole=ROLE_DOCTOR
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id,
                                               @RequestParam Long currentUserId,
                                               @RequestParam String currentUserRole) {
        try {
            doctorService.deleteDoctor(id, currentUserId, currentUserRole);
            return ResponseEntity.ok("Doctor deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Error deleting doctor: " + e.getMessage());
        }
    }

    // -------------------------
    // Get doctor by ID
    // -------------------------
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    // -------------------------
    // Get all doctors / filter by specialization
    // -------------------------
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(
            @RequestParam(required = false) DoctorSpecialization specialization) {
        List<DoctorDTO> doctors = doctorService.getAllDoctors(specialization);
        return ResponseEntity.ok(doctors);
    }

}

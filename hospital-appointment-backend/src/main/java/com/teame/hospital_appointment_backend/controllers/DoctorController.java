package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.DoctorDTO;
import com.teame.hospital_appointment_backend.models.dto.DoctorRegistrationRequest;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------------
    // 1️⃣ Doctor Self-Registration
    // -------------------------
    @PostMapping("/register")
    public ResponseEntity<String> registerDoctor(@RequestBody DoctorRegistrationRequest request) {
        try {
            Doctor doctor = new Doctor();

            // Create User linked to doctor
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            doctor.setName(request.getName());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setPhone(request.getPhone());
            doctor.setConsultationFee(request.getConsultationFee());
            doctor.setUser(user);

            doctorService.registerDoctor(doctor);

            return ResponseEntity.status(201).body("Registration successful. Pending admin approval.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // -------------------------
    // 2️⃣ Approve doctor (Admin)
    // -------------------------
    @PutMapping("/approve/{id}")

    public ResponseEntity<String> approveDoctor(@PathVariable Long id) {
        try {
            doctorService.approveDoctor(id);
            return ResponseEntity.ok("Doctor approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error approving doctor: " + e.getMessage());
        }
    }

    // -------------------------
    // 3️⃣ Update doctor
    // -------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor,
                                               @RequestParam Long currentUserId,
                                               @RequestParam String currentUserRole) {
        try {
            doctorService.updateDoctor(id, doctor, currentUserId, currentUserRole);
            return ResponseEntity.ok("Doctor updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Error updating doctor: " + e.getMessage());
        }
    }

    // -------------------------
    // 4️⃣ Delete doctor
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
    // 5️⃣ Get doctor by ID
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
    // 6️⃣ Get all doctors / filter by specialization
    // -------------------------
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(@RequestParam(required = false) String specialization) {
        List<DoctorDTO> doctors = doctorService.getAllDoctors(specialization);
        return ResponseEntity.ok(doctors);
    }

}

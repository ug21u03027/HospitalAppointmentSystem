package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.DoctorDTO;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private UserDao userDao;

    // -------------------------------
    // Convert Doctor entity to DTO
    // -------------------------------
    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getDoctorId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getAvailability(),
                doctor.getPhone(),
                doctor.getConsultationFee(),
                doctor.getStatus()
        );
    }

    // -------------------------------
    // Register Doctor (fix duplicates)
    // -------------------------------
    public DoctorDTO registerDoctor(Doctor doctor) {
        User user = doctor.getUser();
        if (user == null) throw new RuntimeException("Doctor must have a linked User account!");

        // Trim + lowercase for safe duplicate check
        String usernameClean = user.getUsername().trim().toLowerCase();
        String emailClean = user.getEmail().trim().toLowerCase();

        if (userDao.findByUsernameIgnoreCase(usernameClean).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }
        if (userDao.findByEmailIgnoreCase(emailClean).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // Set defaults
        user.setUsername(usernameClean);
        user.setEmail(emailClean);
        user.setRole(Role.DOCTOR);
        user.setStatus(AccountStatus.PENDING);
        doctor.setStatus("PENDING");
        doctor.setAvailability("NO");

        // Save user first
        User savedUser = userDao.save(user);
        doctor.setUser(savedUser);

        // Save doctor
        Doctor savedDoctor = doctorDao.save(doctor);
        return convertToDTO(savedDoctor);
    }

    // -------------------------------
    // Update Doctor
    // -------------------------------
    public DoctorDTO updateDoctor(Long id, Doctor doctor, Long currentUserId, String currentUserRole) {
        Doctor existingDoctor = doctorDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean isAdmin = "ADMIN".equals(currentUserRole);
        boolean isOwnProfile = existingDoctor.getUser() != null &&
                existingDoctor.getUser().getUserId().equals(currentUserId) &&
                "ACTIVE".equals(existingDoctor.getStatus());

        if (!isAdmin && !isOwnProfile) {
            throw new RuntimeException("Forbidden: cannot update this doctor");
        }

        if (doctor.getName() != null) existingDoctor.setName(doctor.getName());
        if (doctor.getSpecialization() != null) existingDoctor.setSpecialization(doctor.getSpecialization());
        if (doctor.getAvailability() != null) existingDoctor.setAvailability(doctor.getAvailability());
        if (doctor.getPhone() != null) existingDoctor.setPhone(doctor.getPhone());
        if (doctor.getConsultationFee() != null) existingDoctor.setConsultationFee(doctor.getConsultationFee());

        Doctor updatedDoctor = doctorDao.save(existingDoctor);
        return convertToDTO(updatedDoctor);
    }

    // -------------------------------
    // Delete Doctor
    // -------------------------------
    public void deleteDoctor(Long doctorId, Long currentUserId, String currentUserRole) {
        System.out.println("DELETE REQUEST => doctorId=" + doctorId +
                ", currentUserId=" + currentUserId +
                ", currentUserRole=" + currentUserRole);

        Doctor doctor = doctorDao.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        System.out.println("FOUND DOCTOR => userId=" +
                (doctor.getUser() != null ? doctor.getUser().getUserId() : null) +
                ", status=" + doctor.getStatus());

        boolean isAdmin = currentUserRole != null && currentUserRole.toUpperCase().contains("ADMIN");
        boolean isOwnProfile = doctor.getUser() != null &&
                doctor.getUser().getUserId().equals(currentUserId) &&
                "ACTIVE".equals(doctor.getStatus());

        System.out.println("CHECK => isAdmin=" + isAdmin + ", isOwnProfile=" + isOwnProfile);

        if (!isAdmin && !isOwnProfile) {
            throw new RuntimeException("Forbidden: cannot delete this doctor");
        }

        doctorDao.deleteById(doctorId);
    }

    // Approve Doctor
    // -------------------------------
    public DoctorDTO approveDoctor(Long id) {
        Doctor doctor = doctorDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus("ACTIVE");
        doctor.setAvailability("YES");
        Doctor updatedDoctor = doctorDao.save(doctor);

        // Update linked User
        User user = doctor.getUser();
        if (user != null) {
            user.setStatus(AccountStatus.ACTIVATED);
            userDao.save(user);
        }

        return convertToDTO(updatedDoctor);
    }

    // -------------------------------
    // Get Doctor by ID
    // -------------------------------
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToDTO(doctor);
    }

    // -------------------------------
    // Get All Doctors / Filter
    // -------------------------------
    public List<DoctorDTO> getAllDoctors(String specialization) {
        List<Doctor> doctors;
        if (specialization != null && !specialization.isEmpty()) {
            doctors = doctorDao.findBySpecializationContainingIgnoreCase(specialization);
        } else {
            doctors = doctorDao.findAll();
        }
        return doctors.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}

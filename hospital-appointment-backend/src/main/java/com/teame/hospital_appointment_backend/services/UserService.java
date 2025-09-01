package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.Exception.UsernameAlreadyExistsException;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.UserProfile;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private UserDao userDao;

    // -----------------------
    // Profile Handling
    // -----------------------
    public UserProfile getProfile(CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return convertToDto(user);
    }

    private UserProfile convertToDto(User user) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(user.getUserId());
        userProfile.setUsername(user.getUsername());
        userProfile.setEmail(user.getEmail());
        userProfile.setAccountStatus(user.getStatus());
        userProfile.setRole(user.getRole());

        // Role-specific mapping
        if (Role.DOCTOR.equals(user.getRole())) {
            Doctor doctor = (Doctor) doctorDao.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor details missing"));
            userProfile.setDoctorId(doctor.getDoctorId());
            userProfile.setName(doctor.getName());
            userProfile.setAvailability(doctor.getAvailability());
            userProfile.setPhone(doctor.getPhone());
            userProfile.setConsultationFee(doctor.getConsultationFee());
            userProfile.setSpecialization(doctor.getSpecialization());
        } else if (Role.PATIENT.equals(user.getRole())) {
            Patient patient = patientDao.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient details missing"));
            userProfile.setPatientId(patient.getPatientId());
            userProfile.setName(patient.getName());
            userProfile.setAge(patient.getAge());
            userProfile.setPhone(patient.getContact());
        }

        return userProfile;
    }

    // -----------------------
    // Persistence
    // -----------------------

    public User save(User user) {
        return userDao.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userDao.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userDao.existsByEmail(email);
    }

    // -----------------------
    // Registration (NEW)
    // -----------------------
    public Doctor registerDoctor(Doctor doctor) {
        // username duplicate check
        if (userDao.existsByUsername(doctor.getUser().getUsername())) {
            throw new UsernameAlreadyExistsException("Username already taken!");
        }

        // email duplicate check
        if (userDao.existsByEmail(doctor.getUser().getEmail())) {
            throw new UsernameAlreadyExistsException("Email already registered!");
        }

        // Save user first
        User savedUser = userDao.save(doctor.getUser());

        // Link doctor with saved user
        doctor.setUser(savedUser);

        // Save doctor
        return doctorDao.save(doctor);
    }
}

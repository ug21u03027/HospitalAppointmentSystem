package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.AuthRequest;
import com.teame.hospital_appointment_backend.models.dto.AuthResponse;
import com.teame.hospital_appointment_backend.models.dto.RegisterRequest;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserDao userRepository;

    @Autowired
    private PatientDao patientRepository;

    @Autowired
    private DoctorDao doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            if (user.getStatus() == AccountStatus.DEACTIVATED) {
                throw new RuntimeException("Account is deactivated");
            }

            if (user.getStatus() == AccountStatus.BLOCKED) {
                throw new RuntimeException("Account is blocked");
            }

            String token = jwtUtil.generateToken(userDetails);

            return new AuthResponse(token, user.getUsername(), user.getEmail(),
                    user.getRole(), user.getStatus(), "Login successful");

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        // Validation
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(AccountStatus.ACTIVATED);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create role-specific entity
        switch (request.getRole()) {
            case PATIENT:
                Patient patient = new Patient();
                patient.setName(request.getName());
                patient.setAge(request.getAge());
                patient.setContact(request.getContact());
                patient.setUser(savedUser);
                patientRepository.save(patient);
                break;

            case DOCTOR:
                Doctor doctor = new Doctor();
                doctor.setName(request.getName());
                doctor.setSpecialization(request.getSpecialization());
                doctor.setAvailability(request.getAvailability());
                doctor.setPhone(request.getPhone());
                doctor.setConsultationFee(request.getConsultationFee());
                doctor.setUser(savedUser);
                doctorRepository.save(doctor);
                break;

            case ADMIN:
                // Admin doesn't need additional entity
                break;
        }

        // Generate token for immediate login
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, savedUser.getUsername(), savedUser.getEmail(),
                savedUser.getRole(), savedUser.getStatus(), "Registration successful");
    }
}
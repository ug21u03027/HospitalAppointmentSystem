package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.BadRequestException;
import com.teame.hospital_appointment_backend.Exception.ConflictException;
import com.teame.hospital_appointment_backend.Exception.ForbiddenException;
import com.teame.hospital_appointment_backend.Exception.UnauthorizedException;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.LoginRequest;
import com.teame.hospital_appointment_backend.models.dto.AuthResponse;
import com.teame.hospital_appointment_backend.models.dto.RegisterRequest;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
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

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            if (user.getStatus() == AccountStatus.PENDING) {
                throw new ForbiddenException("User has not yet been verified");
            }

            if (user.getStatus() == AccountStatus.BLOCKED) {
                throw new ForbiddenException("Account is blocked");
            }

            String token = jwtUtil.generateToken(userDetails);

            return new AuthResponse(token,"Bearer", user.getUserId(), user.getUsername(), user.getEmail(),
                    user.getRole(), user.getStatus(), "Login successful");

        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid username or password");
        } catch (Exception e) {
            throw new BadRequestException("Authentication failed: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        // Validation
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("account with this email already exists");
        }

        // Create User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if((user.getRole().equals(Role.ADMIN)||user.getRole().equals(Role.DOCTOR)))
            user.setStatus(AccountStatus.PENDING);
        else
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

        if (savedUser.getRole() == Role.PATIENT) {

            CustomUserDetails userDetails = new CustomUserDetails(savedUser);
            String token = jwtUtil.generateToken(userDetails);

            return new AuthResponse(
                    token,
                    "Bearer",
                    savedUser.getUserId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    savedUser.getStatus(),
                    "Registration successful"
            );
        } else {
            // Doctors/Admins stay in PENDING status, no token issued
            return new AuthResponse(
                    null,
                    null,
                    savedUser.getUserId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    savedUser.getStatus(),
                    "Registration successful. Awaiting admin approval."
            );
        }

    }


}
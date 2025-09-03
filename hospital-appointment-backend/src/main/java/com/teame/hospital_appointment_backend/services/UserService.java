package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.BadRequestException;
import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.Exception.UnauthorizedException;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.UserProfile;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private PatientDao patientDao;

    @Autowired
    private UserDao userDao;


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


    public List<UserProfile> getAllUsers(CustomUserDetails authUser) {
        if (!authUser.getUser().getRole().equals(Role.ADMIN)) {
            throw new UnauthorizedException("Only admins can view all users");
        }

        List<User> users = userDao.findAll();
        return users.stream().map(this::convertToDto).toList();
    }


    public UserProfile activateUser(Long userId, CustomUserDetails authUser) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AccountStatus currentStatus = user.getStatus();

        switch (currentStatus) {
            case DEACTIVATED -> {
                // Only the same user can reactivate their own account
                if (!authUser.getUser().getUserId().equals(userId)) {
                    throw new UnauthorizedException("You can only reactivate your own account");
                }
            }
            case PENDING, BLOCKED -> {
                // Only admins can activate pending/blocked accounts
                if (authUser.getUser().getRole() != Role.ADMIN) {
                    throw new UnauthorizedException("Only admins can activate this account");
                }
            }
            case ACTIVATED -> {
                // Already active → no need to throw
                return convertToDto(user);
            }
            default -> throw new BadRequestException("Unsupported account status");
        }

        user.setStatus(AccountStatus.ACTIVATED);
        User activatedUser = userDao.save(user);

        return convertToDto(activatedUser);
    }




    public UserProfile deactivateUser(Long userId, CustomUserDetails authUser) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only the same user can deactivate their own account
        if (!authUser.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only deactivate your own account");
        }

        if (user.getStatus().equals(AccountStatus.DEACTIVATED)) {
            return convertToDto(user); // Already deactivated, no need to change
        }

        user.setStatus(AccountStatus.DEACTIVATED);
        User deactivatedUser = userDao.save(user);

        return convertToDto(deactivatedUser);
    }

    public UserProfile blockUser(Long userId, CustomUserDetails authUser) {
        if (!authUser.getUser().getRole().equals(Role.ADMIN)) {
            throw new UnauthorizedException("Only admins can block users");
        }

        User user = userDao.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(AccountStatus.BLOCKED);
        userDao.save(user);

        return convertToDto(user);
    }

}

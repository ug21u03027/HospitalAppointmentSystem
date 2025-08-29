package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.UserProfile;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private PatientDao patientDao;


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
            Doctor doctor = doctorDao.findByUser_UserId(user.getUserId())
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
}

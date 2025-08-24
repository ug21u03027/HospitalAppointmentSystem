package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.UserDto;
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


    public UserDto getProfile(CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUserId(user.getUserId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setAccountStatus(user.getStatus());
        userDto.setRole(user.getRole());

        // Role-specific mapping
        if (Role.DOCTOR.equals(user.getRole())) {
            Doctor doctor = doctorDao.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Doctor details missing"));
            userDto.setName(doctor.getName());
            userDto.setAvailability(doctor.getAvailability());
            userDto.setPhone(doctor.getPhone());
            userDto.setConsultationFee(doctor.getConsultationFee());
            userDto.setSpecialization(doctor.getSpecialization());
        } else if (Role.PATIENT.equals(user.getRole())) {
            Patient patient = patientDao.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Patient details missing"));
            userDto.setName(patient.getName());
            userDto.setAge(patient.getAge());
            userDto.setPhone(patient.getContact());
        }

        return userDto;
    }
}

package com.teame.hospital_appointment_backend.models.dto;

import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import com.teame.hospital_appointment_backend.models.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
    private Long UserId;
    private String name;
    private String username;
    private String email;
    private Role role;
    private AccountStatus accountStatus;

    //Role specific fields
    private Long patientId;
    private Long doctorId;
    private Integer age;
    private DoctorSpecialization specialization;
    private String availability;
    private String phone;
    private Double consultationFee;
}

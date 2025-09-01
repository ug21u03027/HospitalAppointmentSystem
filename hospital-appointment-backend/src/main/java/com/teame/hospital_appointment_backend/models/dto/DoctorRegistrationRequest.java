package com.teame.hospital_appointment_backend.models.dto;

import lombok.Data;

@Data
public class DoctorRegistrationRequest {
    private String username;
    private String email;
    private String password;

    private String name;
    private String specialization;
    private String phone;
    private Double consultationFee;

}

package com.teame.hospital_appointment_backend.models.dto;

import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType="Bearer";
    private Long userId;
    private String username;
    private String email;
    private Role role;
    private AccountStatus status;
    private String message;
}

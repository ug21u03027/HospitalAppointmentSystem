package com.teame.hospital_appointment_backend.models.dto;

import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import com.teame.hospital_appointment_backend.models.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    // Role-specific fields
    private String name;
    private Integer age;
    private String contact;
    private DoctorSpecialization specialization;
    private String availability;
    private String phone;
    private Double consultationFee;
}

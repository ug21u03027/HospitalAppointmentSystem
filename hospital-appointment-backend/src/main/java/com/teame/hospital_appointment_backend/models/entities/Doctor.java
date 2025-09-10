package com.teame.hospital_appointment_backend.models.entities;

import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;

    private String name;

    @Enumerated(EnumType.STRING)
    private DoctorSpecialization specialization;

    private String availability;

    private String phone;

    private Double consultationFee;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
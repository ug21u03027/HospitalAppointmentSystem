package com.teame.hospital_appointment_backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendSpecialistRequest {
    String symptoms;
    String base64Image;
}
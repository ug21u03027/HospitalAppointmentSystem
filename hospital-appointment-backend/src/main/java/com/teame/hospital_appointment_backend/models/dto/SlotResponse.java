package com.teame.hospital_appointment_backend.models.dto;

import com.teame.hospital_appointment_backend.models.enums.TimeSlot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponse {
    private Long doctorId;
    private String date;
    private List<String> availableSlots;
    private List<String> bookedSlots;
}

package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.dao.AppointmentDao;
import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    AppointmentDao appointmentDao;

    public List<AppointmentDto> getAllAppointments() {
        return null;
    }

    public AppointmentDto createAppointment(AppointmentRequest request) {
        return null;
    }

    public List<AppointmentDto> getpatientAppointments(Long patientId) {
        return null;
    }

    public List<AppointmentDto> getDoctorAppointments(Long doctorId) {
        return null;
    }
}

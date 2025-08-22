package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import com.teame.hospital_appointment_backend.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Get all appointments
    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        List<AppointmentDto> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable("id") Long appointmentId) {
        AppointmentDto appointment = appointmentService.getAppointmentById(appointmentId);
        return ResponseEntity.ok(appointment);
    }

    // Get patient appointments
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDto>> getPatientAppointments(@PathVariable("patientId") Long patientId) {
        List<AppointmentDto> appointments = appointmentService.getPatientAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Get doctor appointments
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDto>> getDoctorAppointments(@PathVariable("doctorId") Long doctorId) {
        List<AppointmentDto> appointments = appointmentService.getDoctorAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    // Create appointment
    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(@RequestBody AppointmentRequest request) {
        AppointmentDto createdAppointment = appointmentService.createAppointment(request);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    // Cancel appointment
    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDto> cancelAppointment(@PathVariable("id") Long appointmentId) {
        AppointmentDto cancelledAppointment = appointmentService
                .updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(cancelledAppointment);
    }

    // Approve appointment
    @PutMapping("/{id}/approve")
    public ResponseEntity<AppointmentDto> approveAppointment(@PathVariable("id") Long appointmentId) {
        AppointmentDto approvedAppointment = appointmentService
                .updateAppointmentStatus(appointmentId, AppointmentStatus.APPROVED);
        return ResponseEntity.ok(approvedAppointment);
    }

    // Reject appointment
    @PutMapping("/{id}/reject")
    public ResponseEntity<AppointmentDto> rejectAppointment(@PathVariable("id") Long appointmentId) {
        AppointmentDto rejectedAppointment = appointmentService
                .updateAppointmentStatus(appointmentId, AppointmentStatus.REJECTED);
        return ResponseEntity.ok(rejectedAppointment);
    }
}
package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.models.dto.SlotRequest;
import com.teame.hospital_appointment_backend.models.dto.SlotResponse;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        List<AppointmentDto> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Get appointment by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT','DOCTOR')")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable("id") Long appointmentId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentDto appointment = appointmentService.getAppointmentById(appointmentId, userDetails);
        return ResponseEntity.ok(appointment);
    }

    // Get patient appointments
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<List<AppointmentDto>> getPatientAppointments(@PathVariable("patientId") Long patientId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AppointmentDto> appointments = appointmentService.getPatientAppointments(patientId, userDetails);
        return ResponseEntity.ok(appointments);
    }

    // Get doctor appointments
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<List<AppointmentDto>> getDoctorAppointments(@PathVariable("doctorId") Long doctorId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AppointmentDto> appointments = appointmentService.getDoctorAppointments(doctorId, userDetails);
        return ResponseEntity.ok(appointments);
    }

    // Create appointment
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> createAppointment(@RequestBody AppointmentRequest request
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentDto createdAppointment = appointmentService.createAppointment(request
                , userDetails);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    // Cancel appointment
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> cancelAppointment(@PathVariable("id") Long appointmentId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentDto cancelledAppointment = appointmentService
                .cancelAppointment(appointmentId, userDetails);
        return ResponseEntity.ok(cancelledAppointment);
    }

    // Approve appointment
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<AppointmentDto> approveAppointment(@PathVariable("id") Long appointmentId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentDto approvedAppointment = appointmentService
                .approveOrRejectAppointment(appointmentId, AppointmentStatus.APPROVED, userDetails);
        return ResponseEntity.ok(approvedAppointment);
    }

    // Reject appointment
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<AppointmentDto> rejectAppointment(@PathVariable("id") Long appointmentId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentDto rejectedAppointment = appointmentService
                .approveOrRejectAppointment(appointmentId, AppointmentStatus.REJECTED, userDetails);
        return ResponseEntity.ok(rejectedAppointment);
    }

    // Get available time slots for a doctor on a specific date
    @GetMapping("/slots")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<SlotResponse> getAvailableSlots(@RequestParam Long doctorId, @RequestParam String date) {
        SlotRequest request = new SlotRequest(doctorId, LocalDate.parse(date));
        SlotResponse slotResponse = appointmentService.getAvailableSlots(request);
        return ResponseEntity.ok(slotResponse);
    }
}
package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ConflictException;
import com.teame.hospital_appointment_backend.Exception.ForbiddenException;
import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.AppointmentDao;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.models.dto.SlotRequest;
import com.teame.hospital_appointment_backend.models.dto.SlotResponse;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.models.enums.TimeSlot;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class AppointmentService {

    private final AppointmentDao appointmentDao;
    private final DoctorDao doctorDao;
    private final PatientDao patientDao;

    @Autowired
    public AppointmentService(AppointmentDao appointmentDao,
                              DoctorDao doctorDao,
                              PatientDao patientDao) {
        this.appointmentDao = appointmentDao;
        this.doctorDao = doctorDao;
        this.patientDao = patientDao;
    }

    public List<AppointmentDto> getAllAppointments() {
        List<Appointment> appointments = appointmentDao.findAll();
        return appointments.stream().map(this::convertToDto).toList();
    }

    public AppointmentDto getAppointmentById(Long appointmentId, CustomUserDetails userDetails) {
        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("appointment not found"));

        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.PATIENT &&
                !appointment.getPatient().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new ForbiddenException("Access denied: not authorised to view this appointment");
        }

        if (currentUser.getRole() == Role.DOCTOR &&
                !appointment.getDoctor().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new ForbiddenException("Access denied: not authorised to view this appointment");
        }

        // Admin can view all
        return convertToDto(appointment);
    }


    public List<AppointmentDto> getPatientAppointments(Long patientId, CustomUserDetails userDetails) {

        Patient patient=patientDao.findById(patientId)
                .orElseThrow(()-> new ResourceNotFoundException("patient not found"));

        if((!patient.getUser().getUserId().equals(userDetails.getUser().getUserId()))
                &&!(userDetails.getUser().getRole().equals(Role.ADMIN))){
            throw new ForbiddenException("access denied: not authorised to view these appointments");
        }

        List<Appointment> appointments = appointmentDao
                .findByPatient_PatientIdOrderByDateDescTimeDesc(patientId);

        return appointments.stream().map(this::convertToDto).toList();
    }

    public List<AppointmentDto> getDoctorAppointments(Long doctorId, CustomUserDetails userDetails) {

        Doctor doctor = doctorDao.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("doctor not found"));

        if ((!doctor.getUser().getUserId().equals(userDetails.getUser().getUserId()))
                &&(!userDetails.getUser().getRole().equals(Role.ADMIN))) {
            throw new ForbiddenException("access denied: not authorised to view these appointments");
        }

        List<Appointment> appointments = appointmentDao
                .findByDoctor_DoctorIdOrderByDateDescTimeDesc(doctorId);

        return appointments.stream().map(this::convertToDto).toList();
    }

    @Transactional
    public AppointmentDto createAppointment(AppointmentRequest request, CustomUserDetails userDetails) {

        Patient patient = patientDao.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("patient not found"));

        if(!patient.getUser().getUserId().equals(userDetails.getUser().getUserId()))
            throw new ForbiddenException("access denied: not authorised to create appointment for requested patient");

        Doctor doctor = doctorDao.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("doctor not found"));

        if (!isSlotAvailable(request.getDoctorId(), request.getDate(), request.getTime()))
            throw new ConflictException("slot not available");

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment savedAppointment = appointmentDao.save(appointment);

        return convertToDto(savedAppointment);
    }

    @Transactional
    public AppointmentDto cancelAppointment(Long appointmentId, CustomUserDetails userDetails) {
        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("appointment not found"));

        // Only the patient who owns the appointment can cancel
        if (!appointment.getPatient().getUser().getUserId().equals(userDetails.getUser().getUserId())) {
            throw new ForbiddenException("access denied: not authorised to cancel this appointment");
        }

        // Cannot cancel if already REJECTED or CANCELLED
        if (appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.REJECTED) {
            throw new ConflictException("appointment status cannot be changed");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return convertToDto(appointmentDao.save(appointment));
    }

    @Transactional
    public AppointmentDto approveOrRejectAppointment(Long appointmentId, AppointmentStatus status, CustomUserDetails userDetails) {
        if (!(status == AppointmentStatus.APPROVED || status == AppointmentStatus.REJECTED)) {
            throw new IllegalArgumentException("Invalid status for doctor action");
        }

        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("appointment not found"));

        if (!appointment.getDoctor().getUser().getUserId().equals(userDetails.getUser().getUserId())
                &&!userDetails.getUser().getRole().equals(Role.ADMIN)) {
            throw new ForbiddenException("access denied: not authorised to update this appointment");
        }

        // Cannot change if already REJECTED or CANCELLED
        if (appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.REJECTED) {
            throw new ConflictException("appointment status cannot be changed");
        }

        appointment.setStatus(status);
        return convertToDto(appointmentDao.save(appointment));
    }


    private AppointmentDto convertToDto(Appointment appointment) {

        AppointmentDto dto = new AppointmentDto();

        dto.setId(appointment.getAppointmentId());
        dto.setDoctorId(appointment.getDoctor().getDoctorId());
        dto.setPatientId(appointment.getPatient().getPatientId());
        dto.setDate(appointment.getDate());
        dto.setTime(appointment.getTime());
        dto.setStatus(appointment.getStatus());
        dto.setSymptoms(appointment.getSymptoms());

        return dto;
    }

    private boolean isSlotAvailable(Long doctorId,
                                      LocalDate appointmentDate,
                                      LocalTime appointmentTime) {

        List<Appointment> existingAppointments = appointmentDao
                .findByDoctor_DoctorIdAndDateAndTimeAndStatusNot(
                        doctorId,
                        appointmentDate,
                        appointmentTime,
                        AppointmentStatus.CANCELLED
                );

        return existingAppointments.isEmpty();
    }

    public SlotResponse getAvailableSlots(SlotRequest request) {
        // Validate doctor exists
        Doctor doctor = doctorDao.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Get all time slots
        List<String> allSlots = Arrays.stream(TimeSlot.values())
                .map(TimeSlot::getTime)
                .collect(Collectors.toList());

        // Get existing appointments for the doctor on the specified date
        List<Appointment> existingAppointments = appointmentDao
                .findByDoctor_DoctorIdAndDateAndStatusNot(
                        request.getDoctorId(),
                        request.getDate(),
                        AppointmentStatus.CANCELLED
                );

        // Get booked time slots
        List<String> bookedSlots = existingAppointments.stream()
                .map(appointment -> appointment.getTime().toString())
                .collect(Collectors.toList());

        // Get available slots (all slots minus booked slots)
        List<String> availableSlots = allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());

        // Create and return response
        SlotResponse response = new SlotResponse();
        response.setDoctorId(request.getDoctorId());
        response.setDate(request.getDate().toString());
        response.setAvailableSlots(availableSlots);
        response.setBookedSlots(bookedSlots);

        return response;
    }
}

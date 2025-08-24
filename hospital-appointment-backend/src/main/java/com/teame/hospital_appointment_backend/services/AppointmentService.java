package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ConflictException;
import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.AppointmentDao;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;


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

    public AppointmentDto getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("appointment not found"));
        return convertToDto(appointment);
    }


    public List<AppointmentDto> getPatientAppointments(Long patientId) {
        if (!patientDao.existsById(patientId))
            throw new ResourceNotFoundException("patient not found");

        List<Appointment> appointments = appointmentDao
                .findByPatientPatientIdOrderByDateDescTimeDesc(patientId);

        return appointments.stream().map(this::convertToDto).toList();
    }

    public List<AppointmentDto> getDoctorAppointments(Long doctorId) {
        if (!doctorDao.existsById(doctorId))
            throw new ResourceNotFoundException("doctor not found");

        List<Appointment> appointments = appointmentDao
                .findByDoctorDoctorIdOrderByDateDescTimeDesc(doctorId);

        return appointments.stream().map(this::convertToDto).toList();
    }

    @Transactional
    public AppointmentDto createAppointment(AppointmentRequest request) {

        Patient patient = patientDao.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("patient not found"));

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
    public AppointmentDto updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {

        Appointment appointment = appointmentDao.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("appointment not found"));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentDao.save(appointment);

        return convertToDto(updatedAppointment);
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
                .findByDoctorDoctorIdAndDateAndTimeAndStatusNot(
                        doctorId,
                        appointmentDate,
                        appointmentTime,
                        AppointmentStatus.CANCELLED
                );

        return existingAppointments.isEmpty();
    }
}

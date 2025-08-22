package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.AppointmentDao;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        List<Appointment> appointments=appointmentDao.findAll();
        return appointments.stream().map(this::convertToDto).toList();
    }

    public AppointmentDto getAppointmentById(Long appointmentId) {
        Appointment appointment=appointmentDao.findById(appointmentId)
                .orElseThrow(()->new ResourceNotFoundException("appointment not found"));
        return convertToDto(appointment);
    }


    public List<AppointmentDto> getPatientAppointments(Long patientId) {
        if(!patientDao.existsById(patientId)){
            throw new ResourceNotFoundException("patient not found");
        }
        List<Appointment> appointments=appointmentDao
                .findByPatientPatientIdIdOrderByDateDescTimeDesc(patientId);
        return appointments.stream().map(this::convertToDto).toList();
    }

    public List<AppointmentDto> getDoctorAppointments(Long doctorId) {
        return null;
    }

    public AppointmentDto createAppointment(AppointmentRequest request) {
        return null;
    }

    public AppointmentDto updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        return null;
    }


    private AppointmentDto convertToDto(Appointment appointment){

        AppointmentDto dto=new AppointmentDto();

        dto.setId(appointment.getAppointmentId());
        dto.setDoctor_id(appointment.getDoctor().getDoctorId());
        dto.setPatient_id(appointment.getPatient().getPatientId());
        dto.setDate(appointment.getDate());
        dto.setTime(appointment.getTime());
        dto.setStatus(appointment.getStatus());
        dto.setSymptoms(appointment.getSymptoms());

        return dto;
    }
}

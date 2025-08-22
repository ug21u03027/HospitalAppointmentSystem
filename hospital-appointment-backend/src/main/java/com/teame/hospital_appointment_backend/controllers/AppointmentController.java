package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.AppointmentDto;
import com.teame.hospital_appointment_backend.models.dto.AppointmentRequest;
import com.teame.hospital_appointment_backend.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(name="/appointments")
public class AppointmentController {

    @Autowired
    AppointmentService appointmentService;

    @GetMapping("/")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments(){
        try{
            List<AppointmentDto> appointments=appointmentService.getAllAppointments();
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDto>> getPatientAppointments(@PathVariable Long patientId) {
        try {
            List<AppointmentDto> appointments = appointmentService.getpatientAppointments(patientId);
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDto>> getUserAppointments(@PathVariable Long doctorId) {
        try {
            List<AppointmentDto> appointments = appointmentService.getDoctorAppointments(doctorId);
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/")
    public ResponseEntity<AppointmentDto> createAppointment(@RequestBody AppointmentRequest request){
        try{
            AppointmentDto createdAppointment=appointmentService.createAppointment(request);
            return new ResponseEntity<>(createdAppointment,HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

//    @PutMapping("/")
}

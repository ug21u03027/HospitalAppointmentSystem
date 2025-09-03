package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.Exception.ForbiddenException;
import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.PatientDto;
import com.teame.hospital_appointment_backend.models.dto.PatientUpdateRequest;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    private final PatientDao patientRepository;

    @Autowired
    public PatientService(PatientDao patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Get patient by ID
    public PatientDto getPatientById(Long patientId, CustomUserDetails userDetails) {

        Patient patient=patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));

        if((!userDetails.getUser().getUserId().equals(patient.getUser().getUserId()))
                && (!userDetails.getUser().getRole().equals(Role.ADMIN)))
            throw new ForbiddenException("Not authorised to access this patient");


        return mapToDto(patient);
    }

    // Update patient
    public PatientDto updatePatient(Long patientId, PatientUpdateRequest updateRequest, CustomUserDetails userDetails) {

        Patient patient=patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));

        if((!userDetails.getUser().getUserId().equals(patient.getUser().getUserId()))
                && (!userDetails.getUser().getRole().equals(Role.ADMIN)))
            throw new ForbiddenException("Not authorised to update this patient's details");

        if(updateRequest.getName()!=null)patient.setName(updateRequest.getName());
        if(updateRequest.getAge()!=null)patient.setAge(updateRequest.getAge());
        if(updateRequest.getContact()!=null)patient.setContact(updateRequest.getContact());
        Patient updatedPatient=patientRepository.save(patient);
        return mapToDto(updatedPatient);
    }

    //convert Patient to PatientDto
    public static PatientDto mapToDto(Patient patient) {
        if (patient == null) {
            return null;
        }
        return new PatientDto(
                patient.getPatientId(),
                patient.getName(),
                patient.getAge(),
                patient.getContact(),
                patient.getUser().getUserId()
        );
    }
}

package com.teame.hospital_appointment_backend.services;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.teame.hospital_appointment_backend.Exception.ForbiddenException;
import com.teame.hospital_appointment_backend.Exception.ResourceNotFoundException;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.models.dto.PatientDto;
import com.teame.hospital_appointment_backend.models.dto.PatientUpdateRequest;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import com.teame.hospital_appointment_backend.models.enums.Role;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class PatientService {

    private final PatientDao patientRepository;
    private final Client client;

    @Autowired
    public PatientService(PatientDao patientRepository) {
        this.patientRepository = patientRepository;
        this.client=new Client();
    }

    // Get patient by ID
    public PatientDto getPatientById(Long patientId, CustomUserDetails userDetails) {

        Patient patient=patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));

        if((!userDetails.getUser().getUserId().equals(patient.getUser().getUserId()))
                && (!userDetails.getUser().getRole().equals(Role.ADMIN))
                &&(!userDetails.getUser().getRole().equals(Role.DOCTOR)))
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


    public DoctorSpecialization recommendSpecialist(String symptoms, String base64Image) {
        try {
            // Construct the prompt with the list of specializations and fallback instruction
            StringBuilder specializationList = new StringBuilder();
            for (DoctorSpecialization s : DoctorSpecialization.values()) {
                specializationList.append(s.name().replace("_", " ")).append(", ");
            }
            if (!specializationList.isEmpty()) {
                specializationList.setLength(specializationList.length() - 2);
            }

            List<Part> parts=new ArrayList<>();

            Part textPart = Part.fromText("Given the following symptoms: " + symptoms + ". " +
                    "Also consider the visible symptom in the provided image, if the image is provided. " + // Added line
                    "From the list of available specializations: " + specializationList + ". " +
                    "Suggest the most appropriate specialist. Only return the specialist name exactly as in the list. " +
                    "If you cannot determine a more specific specialization, return GENERAL PHYSICIAN.");

            parts.add(textPart);

            if(!base64Image.isBlank()){
                byte[] imgBytes= Base64.getDecoder().decode(base64Image);
                parts.add(Part.fromBytes(imgBytes,"image/jpeg"));
            }

            Content content=Content.fromParts(parts.toArray(new Part[0]));

            // Build the request
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    content,
                    null
            );

            // Extract the generated text and map it to a specialization
            String predictedText = response.text();
            System.out.println(mapToSpecialization(predictedText));
            return mapToSpecialization(predictedText);

        } catch (Exception e) {
            e.printStackTrace();
            return DoctorSpecialization.GENERAL_PHYSICIAN;
        }
    }

    private DoctorSpecialization mapToSpecialization(String predictedText) {
        if (predictedText == null || predictedText.isEmpty()) {
            return DoctorSpecialization.GENERAL_PHYSICIAN;
        }

        String normalized = predictedText.toUpperCase()
                .replaceAll("[^A-Z]", "_")
                .replaceAll("__+", "_")
                .trim();

        for (DoctorSpecialization spec : DoctorSpecialization.values()) {
            if (spec.name().equalsIgnoreCase(normalized)) {
                return spec;
            }
        }

        return DoctorSpecialization.GENERAL_PHYSICIAN;
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

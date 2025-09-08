package com.teame.hospital_appointment_backend.services;

import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.dto.DoctorDTO;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
import com.teame.hospital_appointment_backend.models.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorDao doctorDao;

    @Autowired
    private UserDao userDao;

    // -------------------------------
    // Convert Doctor entity to DTO
    // -------------------------------
    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getDoctorId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getAvailability(),
                doctor.getPhone(),
                doctor.getConsultationFee()
        );
    }


    // -------------------------------
    // Update Doctor
    // -------------------------------
    public DoctorDTO updateDoctor(Long id, Doctor doctor, Long currentUserId, String currentUserRole) {
        Doctor existingDoctor = doctorDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean isAdmin = "ADMIN".equals(currentUserRole);
        boolean isOwnProfile = existingDoctor.getUser() != null &&
                existingDoctor.getUser().getUserId().equals(currentUserId);

        if (!isAdmin && !isOwnProfile) {
            throw new RuntimeException("Forbidden: cannot update this doctor");
        }

        if (doctor.getName() != null) existingDoctor.setName(doctor.getName());
        if (doctor.getSpecialization() != null) existingDoctor.setSpecialization(doctor.getSpecialization());
        if (doctor.getAvailability() != null) existingDoctor.setAvailability(doctor.getAvailability());
        if (doctor.getPhone() != null) existingDoctor.setPhone(doctor.getPhone());
        if (doctor.getConsultationFee() != null) existingDoctor.setConsultationFee(doctor.getConsultationFee());

        Doctor updatedDoctor = doctorDao.save(existingDoctor);
        return convertToDTO(updatedDoctor);
    }

    // -------------------------------
    // Delete Doctor
    // -------------------------------
    public void deleteDoctor(Long doctorId, Long currentUserId, String currentUserRole) {
        System.out.println("DELETE REQUEST => doctorId=" + doctorId +
                ", currentUserId=" + currentUserId +
                ", currentUserRole=" + currentUserRole);

        Doctor doctor = doctorDao.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        System.out.println("FOUND DOCTOR => userId=" +
                (doctor.getUser() != null ? doctor.getUser().getUserId() : null));

        boolean isAdmin = currentUserRole != null && currentUserRole.toUpperCase().contains("ADMIN");
        boolean isOwnProfile = doctor.getUser() != null &&
                doctor.getUser().getUserId().equals(currentUserId);

        System.out.println("CHECK => isAdmin=" + isAdmin + ", isOwnProfile=" + isOwnProfile);

        if (!isAdmin && !isOwnProfile) {
            throw new RuntimeException("Forbidden: cannot delete this doctor");
        }

        doctorDao.deleteById(doctorId);
    }


    // -------------------------------
    // Get Doctor by ID
    // -------------------------------
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToDTO(doctor);
    }

    // -------------------------------
    // Get All Doctors / Filter
    // -------------------------------
    public List<DoctorDTO> getAllDoctors(DoctorSpecialization specialization) {
        List<Doctor> doctors;
        if (specialization != null) {
            doctors = doctorDao.findBySpecialization(specialization);
        } else {
            doctors = doctorDao.findAll();
        }
        return doctors.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}

package com.teame.hospital_appointment_backend.config;

import com.teame.hospital_appointment_backend.dao.AppointmentDao;
import com.teame.hospital_appointment_backend.dao.DoctorDao;
import com.teame.hospital_appointment_backend.dao.PatientDao;
import com.teame.hospital_appointment_backend.dao.UserDao;
import com.teame.hospital_appointment_backend.models.entities.Appointment;
import com.teame.hospital_appointment_backend.models.entities.Doctor;
import com.teame.hospital_appointment_backend.models.entities.Patient;
import com.teame.hospital_appointment_backend.models.entities.User;
import com.teame.hospital_appointment_backend.models.enums.AccountStatus;
import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import com.teame.hospital_appointment_backend.models.enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserDao userDao;
    private final DoctorDao doctorDao;
    private final PatientDao patientDao;
    private final AppointmentDao appointmentDao;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserDao userDao, DoctorDao doctorDao, PatientDao patientDao,
                      AppointmentDao appointmentDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.doctorDao = doctorDao;
        this.patientDao = patientDao;
        this.appointmentDao = appointmentDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if(userDao.count() > 0) return; // Avoid duplicate seeding

        // ---- Create Users ----
        User admin1 = new User(null, "admin1", "admin1@example.com",
                passwordEncoder.encode("admin123"), Role.ADMIN, AccountStatus.ACTIVATED, null);
        User admin2 = new User(null, "admin2", "admin2@example.com",
                passwordEncoder.encode("admin123"), Role.ADMIN, AccountStatus.ACTIVATED, null);

        User doctorUser1 = new User(null, "doctor1", "doctor1@example.com",
                passwordEncoder.encode("doctor123"), Role.DOCTOR, AccountStatus.ACTIVATED, null);
        User doctorUser2 = new User(null, "doctor2", "doctor2@example.com",
                passwordEncoder.encode("doctor123"), Role.DOCTOR, AccountStatus.ACTIVATED, null);

        User patientUser1 = new User(null, "patient1", "patient1@example.com",
                passwordEncoder.encode("patient123"), Role.PATIENT, AccountStatus.ACTIVATED, null);
        User patientUser2 = new User(null, "patient2", "patient2@example.com",
                passwordEncoder.encode("patient123"), Role.PATIENT, AccountStatus.ACTIVATED, null);
        User patientUser3 = new User(null, "patient3", "patient3@example.com",
                passwordEncoder.encode("patient123"), Role.PATIENT, AccountStatus.ACTIVATED, null);

        userDao.save(admin1);
        userDao.save(admin2);
        userDao.save(doctorUser1);
        userDao.save(doctorUser2);
        userDao.save(patientUser1);
        userDao.save(patientUser2);
        userDao.save(patientUser3);

        // ---- Create Doctors ----
        Doctor doctor1 = new Doctor(null, "Dr. John Smith", "Cardiology",
                "Mon-Fri 10:00-16:00", "1234567890", 500.0, doctorUser1);
        Doctor doctor2 = new Doctor(null, "Dr. Alice Brown", "Dermatology",
                "Tue-Sat 09:00-15:00", "0987654321", 400.0, doctorUser2);

        doctorDao.save(doctor1);
        doctorDao.save(doctor2);

        // ---- Create Patients ----
        Patient patient1 = new Patient(null, "Patient One", 30, "1111111111", patientUser1);
        Patient patient2 = new Patient(null, "Patient Two", 25, "2222222222", patientUser2);
        Patient patient3 = new Patient(null, "Patient Three", 40, "3333333333", patientUser3);

        patientDao.save(patient1);
        patientDao.save(patient2);
        patientDao.save(patient3);

        // ---- Create Appointments ----
        Appointment appt1 = new Appointment(null, patient1, doctor1,
                LocalDate.now().plusDays(1), LocalTime.of(10, 0), "Fever", AppointmentStatus.PENDING, null);
        Appointment appt2 = new Appointment(null, patient1, doctor2,
                LocalDate.now().plusDays(2), LocalTime.of(11, 0), "Skin rash", AppointmentStatus.PENDING, null);

        Appointment appt3 = new Appointment(null, patient2, doctor1,
                LocalDate.now().plusDays(1), LocalTime.of(12, 0), "Chest pain", AppointmentStatus.PENDING, null);
        Appointment appt4 = new Appointment(null, patient2, doctor2,
                LocalDate.now().plusDays(3), LocalTime.of(13, 0), "Acne", AppointmentStatus.PENDING, null);

        Appointment appt5 = new Appointment(null, patient3, doctor1,
                LocalDate.now().plusDays(2), LocalTime.of(14, 0), "Headache", AppointmentStatus.PENDING, null);
        Appointment appt6 = new Appointment(null, patient3, doctor2,
                LocalDate.now().plusDays(3), LocalTime.of(15, 0), "Skin allergy", AppointmentStatus.PENDING, null);

        appointmentDao.save(appt1);
        appointmentDao.save(appt2);
        appointmentDao.save(appt3);
        appointmentDao.save(appt4);
        appointmentDao.save(appt5);
        appointmentDao.save(appt6);

        System.out.println("Dummy data seeded successfully!");
    }
}

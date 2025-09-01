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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

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
    public void run(String... args) {

        if (userDao.count() > 0) return; // Avoid duplicate seeding

        // ---- Users ----
        User admin1 = new User();
        admin1.setUsername("admin1");
        admin1.setEmail("admin1@example.com");
        admin1.setPassword(passwordEncoder.encode("admin123"));
        admin1.setRole(Role.ADMIN);
        admin1.setStatus(AccountStatus.ACTIVATED);

        User admin2 = new User();
        admin2.setUsername("admin2");
        admin2.setEmail("admin2@example.com");
        admin2.setPassword(passwordEncoder.encode("admin123"));
        admin2.setRole(Role.ADMIN);
        admin2.setStatus(AccountStatus.ACTIVATED);

        User doctorUser1 = new User();
        doctorUser1.setUsername("doctor1");
        doctorUser1.setEmail("doctor1@example.com");
        doctorUser1.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser1.setRole(Role.DOCTOR);
        doctorUser1.setStatus(AccountStatus.ACTIVATED);

        User doctorUser2 = new User();
        doctorUser2.setUsername("doctor2");
        doctorUser2.setEmail("doctor2@example.com");
        doctorUser2.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser2.setRole(Role.DOCTOR);
        doctorUser2.setStatus(AccountStatus.ACTIVATED);

        User patientUser1 = new User();
        patientUser1.setUsername("patient1");
        patientUser1.setEmail("patient1@example.com");
        patientUser1.setPassword(passwordEncoder.encode("patient123"));
        patientUser1.setRole(Role.PATIENT);
        patientUser1.setStatus(AccountStatus.ACTIVATED);

        User patientUser2 = new User();
        patientUser2.setUsername("patient2");
        patientUser2.setEmail("patient2@example.com");
        patientUser2.setPassword(passwordEncoder.encode("patient123"));
        patientUser2.setRole(Role.PATIENT);
        patientUser2.setStatus(AccountStatus.ACTIVATED);

        User patientUser3 = new User();
        patientUser3.setUsername("patient3");
        patientUser3.setEmail("patient3@example.com");
        patientUser3.setPassword(passwordEncoder.encode("patient123"));
        patientUser3.setRole(Role.PATIENT);
        patientUser3.setStatus(AccountStatus.ACTIVATED);

        userDao.saveAll(List.of(admin1, admin2, doctorUser1, doctorUser2, patientUser1, patientUser2, patientUser3));

        // ---- Doctors ----
        Doctor doctor1 = new Doctor();
        doctor1.setName("Dr. John Smith");
        doctor1.setSpecialization("Cardiology");
        doctor1.setAvailability("Mon-Fri 10:00-16:00");
        doctor1.setPhone("1234567890");
        doctor1.setConsultationFee(500.0);
        doctor1.setUser(doctorUser1);

        Doctor doctor2 = new Doctor();
        doctor2.setName("Dr. Alice Brown");
        doctor2.setSpecialization("Dermatology");
        doctor2.setAvailability("Tue-Sat 09:00-15:00");
        doctor2.setPhone("0987654321");
        doctor2.setConsultationFee(400.0);
        doctor2.setUser(doctorUser2);

        doctorDao.saveAll(List.of(doctor1, doctor2));

        // ---- Patients ----
        Patient patient1 = new Patient();
        patient1.setName("Patient One");
        patient1.setAge(30);
        patient1.setContact("1111111111");
        patient1.setUser(patientUser1);

        Patient patient2 = new Patient();
        patient2.setName("Patient Two");
        patient2.setAge(25);
        patient2.setContact("2222222222");
        patient2.setUser(patientUser2);

        Patient patient3 = new Patient();
        patient3.setName("Patient Three");
        patient3.setAge(40);
        patient3.setContact("3333333333");
        patient3.setUser(patientUser3);

        patientDao.saveAll(List.of(patient1, patient2, patient3));

        // ---- Appointments ----
        Appointment appt1 = new Appointment();
        appt1.setPatient(patient1);
        appt1.setDoctor(doctor1);
        appt1.setDate(LocalDate.now().plusDays(1));
        appt1.setTime(LocalTime.of(10, 0));
        appt1.setSymptoms("Fever");
        appt1.setStatus(AppointmentStatus.PENDING);

        Appointment appt2 = new Appointment();
        appt2.setPatient(patient1);
        appt2.setDoctor(doctor2);
        appt2.setDate(LocalDate.now().plusDays(2));
        appt2.setTime(LocalTime.of(11, 0));
        appt2.setSymptoms("Skin rash");
        appt2.setStatus(AppointmentStatus.PENDING);

        Appointment appt3 = new Appointment();
        appt3.setPatient(patient2);
        appt3.setDoctor(doctor1);
        appt3.setDate(LocalDate.now().plusDays(1));
        appt3.setTime(LocalTime.of(12, 0));
        appt3.setSymptoms("Chest pain");
        appt3.setStatus(AppointmentStatus.PENDING);

        Appointment appt4 = new Appointment();
        appt4.setPatient(patient2);
        appt4.setDoctor(doctor2);
        appt4.setDate(LocalDate.now().plusDays(3));
        appt4.setTime(LocalTime.of(13, 0));
        appt4.setSymptoms("Acne");
        appt4.setStatus(AppointmentStatus.PENDING);

        Appointment appt5 = new Appointment();
        appt5.setPatient(patient3);
        appt5.setDoctor(doctor1);
        appt5.setDate(LocalDate.now().plusDays(2));
        appt5.setTime(LocalTime.of(14, 0));
        appt5.setSymptoms("Headache");
        appt5.setStatus(AppointmentStatus.PENDING);

        Appointment appt6 = new Appointment();
        appt6.setPatient(patient3);
        appt6.setDoctor(doctor2);
        appt6.setDate(LocalDate.now().plusDays(3));
        appt6.setTime(LocalTime.of(15, 0));
        appt6.setSymptoms("Skin allergy");
        appt6.setStatus(AppointmentStatus.PENDING);

        appointmentDao.saveAll(List.of(appt1, appt2, appt3, appt4, appt5, appt6));

        logger.info("Dummy data seeded successfully!");
    }
}
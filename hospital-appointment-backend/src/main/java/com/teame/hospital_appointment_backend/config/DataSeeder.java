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
import com.teame.hospital_appointment_backend.models.enums.DoctorSpecialization;
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

        // ---- Users ----
        User doctorUser3 = new User();
        doctorUser3.setUsername("doctor3");
        doctorUser3.setEmail("doctor3@example.com");
        doctorUser3.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser3.setRole(Role.DOCTOR);
        doctorUser3.setStatus(AccountStatus.ACTIVATED);

        User doctorUser4 = new User();
        doctorUser4.setUsername("doctor4");
        doctorUser4.setEmail("doctor4@example.com");
        doctorUser4.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser4.setRole(Role.DOCTOR);
        doctorUser4.setStatus(AccountStatus.ACTIVATED);

        User doctorUser5 = new User();
        doctorUser5.setUsername("doctor5");
        doctorUser5.setEmail("doctor5@example.com");
        doctorUser5.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser5.setRole(Role.DOCTOR);
        doctorUser5.setStatus(AccountStatus.ACTIVATED);

        User doctorUser6 = new User();
        doctorUser6.setUsername("doctor6");
        doctorUser6.setEmail("doctor6@example.com");
        doctorUser6.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser6.setRole(Role.DOCTOR);
        doctorUser6.setStatus(AccountStatus.ACTIVATED);

        User doctorUser7 = new User();
        doctorUser7.setUsername("doctor7");
        doctorUser7.setEmail("doctor7@example.com");
        doctorUser7.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser7.setRole(Role.DOCTOR);
        doctorUser7.setStatus(AccountStatus.ACTIVATED);

        User doctorUser8 = new User();
        doctorUser8.setUsername("doctor8");
        doctorUser8.setEmail("doctor8@example.com");
        doctorUser8.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser8.setRole(Role.DOCTOR);
        doctorUser8.setStatus(AccountStatus.ACTIVATED);

        User doctorUser9 = new User();
        doctorUser9.setUsername("doctor9");
        doctorUser9.setEmail("doctor9@example.com");
        doctorUser9.setPassword(passwordEncoder.encode("doctor123"));
        doctorUser9.setRole(Role.DOCTOR);
        doctorUser9.setStatus(AccountStatus.ACTIVATED);

        userDao.saveAll(List.of(
                admin1, admin2,
                doctorUser1, doctorUser2, doctorUser3, doctorUser4, doctorUser5, doctorUser6, doctorUser7, doctorUser8, doctorUser9,
                patientUser1, patientUser2, patientUser3
        ));

        // ---- Doctors ----

        Doctor doctor1 = new Doctor();
        doctor1.setName("Dr. John Smith");
        doctor1.setSpecialization(DoctorSpecialization.CARDIOLOGIST);
        doctor1.setAvailability("Mon-Fri 09:00-16:00");
        doctor1.setPhone("1234567890");
        doctor1.setConsultationFee(500.0);
        doctor1.setUser(doctorUser1);

        Doctor doctor2 = new Doctor();
        doctor2.setName("Dr. Alice Brown");
        doctor2.setSpecialization(DoctorSpecialization.DERMATOLOGIST);
        doctor2.setAvailability("Tue-Sat 09:00-16:00");
        doctor2.setPhone("0987654321");
        doctor2.setConsultationFee(400.0);
        doctor2.setUser(doctorUser2);

        Doctor doctor3 = new Doctor();
        doctor3.setName("Dr. Michael Lee");
        doctor3.setSpecialization(DoctorSpecialization.NEUROLOGIST);
        doctor3.setAvailability("Mon-Fri 10:00-17:00");
        doctor3.setPhone("1112223333");
        doctor3.setConsultationFee(600.0);
        doctor3.setUser(doctorUser3);

        Doctor doctor4 = new Doctor();
        doctor4.setName("Dr. Sarah Johnson");
        doctor4.setSpecialization(DoctorSpecialization.PEDIATRICIAN);
        doctor4.setAvailability("Mon-Sat 08:00-14:00");
        doctor4.setPhone("2223334444");
        doctor4.setConsultationFee(350.0);
        doctor4.setUser(doctorUser4);

        Doctor doctor5 = new Doctor();
        doctor5.setName("Dr. David Kim");
        doctor5.setSpecialization(DoctorSpecialization.ORTHOPEDIC_SURGEON);
        doctor5.setAvailability("Tue-Fri 12:00-18:00");
        doctor5.setPhone("3334445555");
        doctor5.setConsultationFee(700.0);
        doctor5.setUser(doctorUser5);

        Doctor doctor6 = new Doctor();
        doctor6.setName("Dr. Emily Davis");
        doctor6.setSpecialization(DoctorSpecialization.GYNECOLOGIST);
        doctor6.setAvailability("Mon-Fri 09:00-13:00");
        doctor6.setPhone("4445556666");
        doctor6.setConsultationFee(450.0);
        doctor6.setUser(doctorUser6);

        Doctor doctor7 = new Doctor();
        doctor7.setName("Dr. Robert Wilson");
        doctor7.setSpecialization(DoctorSpecialization.ENT_SPECIALIST);
        doctor7.setAvailability("Wed-Sun 14:00-20:00");
        doctor7.setPhone("5556667777");
        doctor7.setConsultationFee(400.0);
        doctor7.setUser(doctorUser7);

        Doctor doctor8 = new Doctor();
        doctor8.setName("Dr. Laura Martinez");
        doctor8.setSpecialization(DoctorSpecialization.ONCOLOGIST);
        doctor8.setAvailability("Mon-Fri 10:00-15:00");
        doctor8.setPhone("6667778888");
        doctor8.setConsultationFee(800.0);
        doctor8.setUser(doctorUser8);

        Doctor doctor9 = new Doctor();
        doctor9.setName("Dr. James Anderson");
        doctor9.setSpecialization(DoctorSpecialization.PSYCHIATRIST);
        doctor9.setAvailability("Tue-Sat 11:00-17:00");
        doctor9.setPhone("7778889999");
        doctor9.setConsultationFee(550.0);
        doctor9.setUser(doctorUser9);

        doctorDao.saveAll(List.of(doctor1, doctor2, doctor3, doctor4, doctor5, doctor6, doctor7, doctor8, doctor9));

        // ---- Patients ----
        Patient patient1 = new Patient();
        patient1.setName("Mr. Aman Gupta");
        patient1.setAge(30);
        patient1.setContact("1111111111");
        patient1.setUser(patientUser1);

        Patient patient2 = new Patient();
        patient2.setName("Mr. Ramesh Kumar");
        patient2.setAge(25);
        patient2.setContact("2222222222");
        patient2.setUser(patientUser2);

        Patient patient3 = new Patient();
        patient3.setName("Mrs. Shreya Soni");
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
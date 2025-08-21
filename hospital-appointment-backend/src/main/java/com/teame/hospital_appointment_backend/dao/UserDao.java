package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Long> {}

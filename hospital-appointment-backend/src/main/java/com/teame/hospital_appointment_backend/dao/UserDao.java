package com.teame.hospital_appointment_backend.dao;

import com.teame.hospital_appointment_backend.models.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserDao extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Object> findByUsernameIgnoreCase(String usernameClean);

    Optional<Object> findByEmailIgnoreCase(String emailClean);
}

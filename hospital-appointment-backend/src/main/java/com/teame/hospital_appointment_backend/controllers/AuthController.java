package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.*;
import com.teame.hospital_appointment_backend.services.AuthService;
import com.teame.hospital_appointment_backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);

    }

}

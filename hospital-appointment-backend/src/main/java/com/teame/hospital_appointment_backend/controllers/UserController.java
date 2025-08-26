package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.ApiResponse;
import com.teame.hospital_appointment_backend.models.dto.UserProfile;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT','DOCTOR')")
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
            UserProfile userProfile = userService.getProfile(userDetails);
            return ResponseEntity.ok(userProfile);
    }
}

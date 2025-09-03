package com.teame.hospital_appointment_backend.controllers;

import com.teame.hospital_appointment_backend.models.dto.UserProfile;
import com.teame.hospital_appointment_backend.security.CustomUserDetails;
import com.teame.hospital_appointment_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT','DOCTOR')")
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfile userProfile = userService.getProfile(userDetails);
        return ResponseEntity.ok(userProfile);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getAllUsers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<UserProfile> userList = userService.getAllUsers(userDetails);
        return ResponseEntity.ok(userList);
    }


    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')")
    public ResponseEntity<UserProfile> activateUser(@PathVariable("userId") Long userId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfile userProfile = userService.activateUser(userId, userDetails);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/{userId}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')")
    public ResponseEntity<UserProfile> deactivateUser(@PathVariable("userId") Long userId
    , @AuthenticationPrincipal CustomUserDetails userDetails){
        UserProfile userProfile=userService.deactivateUser(userId, userDetails);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/{userId}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> BlockUser(@PathVariable("userId") Long userId
            , @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfile userProfile=userService.blockUser(userId, userDetails);
        return ResponseEntity.ok(userProfile);
    }


}

package com.teame.hospital_appointment_backend.Exception;

public class ConflictException extends RuntimeException {
    public ConflictException(String message){
        super(message);
    }
}

package com.teame.hospital_appointment_backend.Exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message){
        super(message);
    }
}

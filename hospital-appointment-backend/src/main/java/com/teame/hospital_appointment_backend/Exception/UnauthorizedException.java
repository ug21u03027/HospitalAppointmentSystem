package com.teame.hospital_appointment_backend.Exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message){
        super(message);
    }
}

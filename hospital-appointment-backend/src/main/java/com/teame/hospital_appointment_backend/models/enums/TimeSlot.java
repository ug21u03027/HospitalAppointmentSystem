package com.teame.hospital_appointment_backend.models.enums;

public enum TimeSlot {
    NINE_AM("09:00"),
    TEN_AM("10:00"),
    ELEVEN_AM("11:00"),
    TWO_PM("14:00"),
    THREE_PM("15:00"),
    FOUR_PM("16:00");

    private final String time;

    TimeSlot(String time) {
        this.time = time;
    }

    public String getTime() {
        return time;
    }

    public static TimeSlot fromTime(String time) {
        for (TimeSlot slot : TimeSlot.values()) {
            if (slot.getTime().equals(time)) {
                return slot;
            }
        }
        throw new IllegalArgumentException("Invalid time slot: " + time);
    }
}

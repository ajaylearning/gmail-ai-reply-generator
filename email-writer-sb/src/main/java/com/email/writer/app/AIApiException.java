package com.email.writer.app;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.SERVICE_UNAVAILABLE, reason = "The AI service is currently unavailable.")
public class AIApiException extends RuntimeException {
    public AIApiException(String message, Throwable cause) {
        super(message, cause);
    }

    public AIApiException(String message) {
        super(message);
    }
} 
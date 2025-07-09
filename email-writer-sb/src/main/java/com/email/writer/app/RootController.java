package com.email.writer.app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public String healthCheck() {
        return "Email Writer API is up and running!";
    }
} 
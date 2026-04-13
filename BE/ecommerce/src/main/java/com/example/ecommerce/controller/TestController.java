package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Backend OK";
    }
}
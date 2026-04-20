package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    // @GetMapping("/test")
    // public String test() {
    // return "Backend OK";
    // }

    @GetMapping("/hello")
    public java.util.Map<String, String> hello() {
        return java.util.Map.of("message", "Hello Nextjs + SpringBoot");
    }

}
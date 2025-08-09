package com.aaspaas.backend.controller;

import com.aaspaas.backend.service.GeminiVisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class IdentifyController {

    @Autowired
    private GeminiVisionService geminiVisionService;

    @PostMapping(value = "/identify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> identifyBusiness(@RequestParam("file") MultipartFile file) {
        try {
            // Call the service with the uploaded file
            String jsonResponse = geminiVisionService.analyzeImage(file);
            // Return the clean JSON response from the service
            return ResponseEntity.ok(jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to analyze image: " + e.getMessage() + "\"}");
        }
    }
}
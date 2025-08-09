package com.aaspaas.backend.controller;

import com.aaspaas.backend.dto.IdentifyResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
public class IdentifyController {

    @PostMapping("/identify")
    public ResponseEntity<IdentifyResponse> identifyBusiness(@RequestParam("file") MultipartFile file) {
        // For now, return a dummy response. The AI logic will go here later.
        System.out.println("Received file: " + file.getOriginalFilename());

        IdentifyResponse dummyResponse = new IdentifyResponse(
            "Dummy Business Type",
            List.of("dummyTag1", "dummyTag2"),
            "This is a dummy description from the backend."
        );
        return ResponseEntity.ok(dummyResponse);
    }
}

package com.aaspaas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class IdentifyResponse {
    private String businessType;
    private List<String> tags;
    private String description;
}
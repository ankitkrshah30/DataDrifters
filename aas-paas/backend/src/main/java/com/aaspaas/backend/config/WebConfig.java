package com.aaspaas.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Allow CORS for all /api endpoints
            .allowedOrigins("http://localhost:3000") // The default React dev server port
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
package com.aaspaas.backend.service;

import com.google.gson.Gson;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GeminiVisionService {

    // Spring will inject the API key from application.properties
    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    public String analyzeImage(MultipartFile imageFile) throws IOException {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        // 1. Get image bytes from the uploaded file and convert to Base64
        byte[] imageBytes = imageFile.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        // 2. Create the JSON payload structure
        String prompt = "You are an expert at analyzing images of local Indian businesses. "
                + "Analyze the provided image and respond ONLY with a single JSON object that strictly follows this structure: "
                + "{ \"businessType\": \"...\", \"tags\": [\"...\", \"...\"], \"description\": \"...\" }. "
                + "The description should be a friendly, one-sentence summary.";

        Map<String, String> textPart = Collections.singletonMap("text", prompt);
        Map<String, Object> inlineData = Map.of("mime_type", imageFile.getContentType(), "data", base64Image);
        Map<String, Object> imagePart = Collections.singletonMap("inline_data", inlineData);
        Map<String, List<Map<String, Object>>> contents = Collections.singletonMap("contents", List.of(Map.of("parts", List.of(textPart, imagePart))));
        String jsonPayload = gson.toJson(contents);

        // 3. Build and execute the HTTP request
        RequestBody body = RequestBody.create(jsonPayload, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(apiUrl).post(body).build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("API call failed with code " + response.code() + " and body " + response.body().string());
            }
            String responseBodyString = response.body().string();

            // 4. Parse and clean the response to get pure JSON
            Map<String, Object> responseMap = gson.fromJson(responseBodyString, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
            String rawText = parts.get(0).get("text");

            int firstBrace = rawText.indexOf('{');
            int lastBrace = rawText.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1) {
                return rawText.substring(firstBrace, lastBrace + 1);
            }
            return rawText; // Fallback
        }
    }
}
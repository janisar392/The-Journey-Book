package com.janisar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleConfig {

    private static String apiKey;

    @Value("${google.api.key}")
    public void setApiKey(String key) {
        apiKey = key;
        System.out.println("Google API Key loaded: " + apiKey);
    }

    public static String getApiKey() {
        return apiKey;
    }
}
package com.janisar.controller;

import com.janisar.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/travel-tools")
@CrossOrigin(origins = {"http://localhost:3000", "https://the-journey-book.netlify.app"})
public class TravelToolsController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        try {
            Map<String, Object> weather = weatherService.getWeatherWithFallback(city);

            if (weather != null) {
                // Check if data is from cache or real API
                String source = (String) weather.getOrDefault("source", "Unknown");
                System.out.println("✅ Weather response source: " + source);
                return ResponseEntity.ok(weather);
            }

            return ResponseEntity.badRequest().body(Map.of("error", "Weather data not available"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
package com.janisar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;  // ← CORRECT import
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String API_KEY = "d252c3e6fda49485f8ef9d0c51a8bc75";

    @Autowired
    @Lazy
    private WeatherService self;

    public Map<String, Object> getWeatherWithFallback(String city) {
        Map<String, Object> weather = self.getWeatherFromApi(city);

        if (weather == null) {
            System.out.println("⚠️ Using mock data for: " + city);
            return getMockWeatherData(city);
        }

        return weather;
    }

    @Cacheable(value = "weather", key = "#city", unless = "#result == null")
    public Map<String, Object> getWeatherFromApi(String city) {
        System.out.println("🔄 Fetching weather from OpenWeather API for: " + city);

        try {
            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                    city, API_KEY
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> main = (Map<String, Object>) response.get("main");

                @SuppressWarnings("unchecked")
                java.util.List<Map<String, Object>> weatherList =
                        (java.util.List<Map<String, Object>>) response.get("weather");

                if (main != null && weatherList != null && !weatherList.isEmpty()) {
                    Map<String, Object> weather = weatherList.get(0);

                    Map<String, Object> result = new HashMap<>();
                    result.put("city", response.get("name"));
                    result.put("temperature", main.get("temp"));
                    result.put("feelsLike", main.get("feels_like"));
                    result.put("humidity", main.get("humidity"));
                    result.put("description", weather.get("description"));
                    result.put("icon", weather.get("icon"));
                    result.put("source", "OpenWeather API");

                    return result;
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Weather API error: " + e.getMessage());
        }

        return null;
    }

    private Map<String, Object> getMockWeatherData(String city) {
        Map<String, Object> mockData = new HashMap<>();
        mockData.put("city", city);
        mockData.put("temperature", 25);
        mockData.put("feelsLike", 27);
        mockData.put("humidity", 60);
        mockData.put("description", "Partly Cloudy");
        mockData.put("icon", "03d");
        mockData.put("source", "Mock Data");
        return mockData;
    }
}
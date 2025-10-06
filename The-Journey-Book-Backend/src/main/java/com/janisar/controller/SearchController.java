package com.janisar.controller;

import com.janisar.dto.PlaceResult;
import com.janisar.dto.SearchRequest;
import com.janisar.config.GoogleConfig;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<List<PlaceResult>> search(@RequestBody SearchRequest searchRequest) {

        System.out.println("Received search for: " + searchRequest.getLocation());

        try {
            // 1. Build the URL for Google Places API Text Search
            String apiKey = GoogleConfig.getApiKey();
            System.out.println("Using API Key: " + apiKey);

            String url = buildGooglePlacesUrl(searchRequest.getLocation(), apiKey);
            System.out.println("Calling Google API: " + url);

            // 2. Make the API call to Google (get raw response first)
            ResponseEntity<String> rawResponse = restTemplate.getForEntity(url, String.class);
            System.out.println("Google API Response Status: " + rawResponse.getStatusCode());
            System.out.println("Google API Response Body: " + rawResponse.getBody());

            // 3. If successful, process the response
            if (rawResponse.getStatusCode().is2xxSuccessful()) {
                // Parse the JSON response properly
                // For now, let's just return mock data to test the flow
                System.out.println("Google API call successful!");
                return ResponseEntity.ok(getFallbackMockData(searchRequest.getLocation()));
            } else {
                System.out.println("Google API returned error: " + rawResponse.getStatusCode());
                return ResponseEntity.ok(getFallbackMockData(searchRequest.getLocation()));
            }

        } catch (Exception e) {
            System.err.println("Error calling Google Places API: " + e.getMessage());
            e.printStackTrace();
            // Fallback to mock data
            return ResponseEntity.ok(getFallbackMockData(searchRequest.getLocation()));
        }
    }

    private String buildGooglePlacesUrl(String location, String apiKey) {
        String encodedQuery = java.net.URLEncoder.encode(location, java.nio.charset.StandardCharsets.UTF_8);
        return "https://maps.googleapis.com/maps/api/place/textsearch/json" +
                "?query=" + encodedQuery +
                "&key=" + apiKey;
    }

    private List<PlaceResult> getFallbackMockData(String searchLocation) {
        System.out.println("Using enhanced mock data for: " + searchLocation);

        String location = searchLocation.toLowerCase();

        // Tokyo - Enhanced with 6 attractions
        if (location.contains("tokyo")) {
            return List.of(
                    // Working Unsplash URLs for Tokyo:
                    new PlaceResult("1", "Tokyo Skytree", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", "Tokyo, Japan", 4.7, "tours"),
                    new PlaceResult("2", "Senso-ji Temple", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", "Tokyo, Japan", 4.8, "museums"),
                    new PlaceResult("3", "Shibuya Crossing", "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=800", "Tokyo, Japan", 4.6, "entertainment"),
                    new PlaceResult("4", "Meiji Shrine", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", "Tokyo, Japan", 4.5, "nature"), // Using Senso-ji image as fallback
                    new PlaceResult("5", "Tokyo National Museum", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Main_building_of_the_Tokyo_National_Museum.jpg/960px-Main_building_of_the_Tokyo_National_Museum.jpg?20210724050315", "Tokyo, Japan", 4.4, "museums"),
                    new PlaceResult("6", "Ueno Park", "https://media1.thrillophilia.com/filestore/8o5jyhna9ru9xy9y7sldofr24dgf_Ueno%20park%20(1).jpg?w=1440&dpr=2", "Tokyo, Japan", 4.3, "nature")            );
        }
        // London - Enhanced with 6 attractions
        else if (location.contains("london")) {
            return List.of(
                    new PlaceResult("7", "Big Ben", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "London, UK", 4.7, "tours"),
                    new PlaceResult("8", "London Eye", "https://c.pxhere.com/photos/92/e9/london_ferris_wheel_streetlight_bro_london_eye_england_blue_sky_cloud-802337.jpg!d", "London, UK", 4.8, "tours"),
                    new PlaceResult("9", "Tower Bridge", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800", "London, UK", 4.6, "tours"),
                    new PlaceResult("10", "British Museum", "https://cdn.pixabay.com/photo/2013/08/15/14/15/london-172794_640.jpg", "London, UK", 4.9, "museums"),
                    new PlaceResult("11", "Buckingham Palace", "https://cdn.pixabay.com/photo/2016/12/26/13/31/london-1932142_640.jpg", "London, UK", 4.5, "tours"),
                    new PlaceResult("12", "Hyde Park", "https://cdn.pixabay.com/photo/2015/08/15/23/45/houses-890351_640.jpg", "London, UK", 4.4, "nature")
            );
        }
        // Paris - 6 attractions
        else if (location.contains("paris")) {
            return List.of(
                    new PlaceResult("13", "Eiffel Tower", "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800", "Paris, France", 4.8, "tours"),
                    new PlaceResult("14", "Louvre Museum", "https://images.unsplash.com/photo-1594651691728-82c5d3594277?w=800", "Paris, France", 4.9, "museums"),
                    new PlaceResult("15", "Notre-Dame Cathedral", "https://images.unsplash.com/photo-1566416800996-ec16e3d683a0?w=800", "Paris, France", 4.7, "museums"),
                    new PlaceResult("16", "Arc de Triomphe", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Paris, France", 4.6, "tours"),
                    new PlaceResult("17", "Montmartre", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Paris, France", 4.5, "tours"),
                    new PlaceResult("18", "Seine River Cruise", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Paris, France", 4.7, "entertainment")
            );
        }
        // Dubai - 6 attractions
        else if (location.contains("dubai")) {
            return List.of(
                    new PlaceResult("19", "Burj Khalifa", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "Dubai, UAE", 4.8, "tours"),
                    new PlaceResult("20", "Dubai Mall", "https://images.unsplash.com/photo-1582573618381-c9a77c31f6b6?w=800", "Dubai, UAE", 4.6, "entertainment"),
                    new PlaceResult("21", "Palm Jumeirah", "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800", "Dubai, UAE", 4.7, "tours"),
                    new PlaceResult("22", "Dubai Fountain", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Dubai, UAE", 4.5, "entertainment"),
                    new PlaceResult("23", "Desert Safari", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Dubai, UAE", 4.9, "nature"),
                    new PlaceResult("24", "Miracle Garden", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Dubai, UAE", 4.4, "nature")
            );
        }
        // Bali - 6 attractions
        else if (location.contains("bali")) {
            return List.of(
                    new PlaceResult("25", "Tanah Lot Temple", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800", "Bali, Indonesia", 4.7, "museums"),
                    new PlaceResult("26", "Uluwatu Temple", "https://images.unsplash.com/photo-1553659971-f01207815908?w=800", "Bali, Indonesia", 4.8, "museums"),
                    new PlaceResult("27", "Tegallalang Rice Terraces", "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800", "Bali, Indonesia", 4.6, "nature"),
                    new PlaceResult("28", "Mount Batur Sunrise", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Bali, Indonesia", 4.9, "nature"),
                    new PlaceResult("29", "Ubud Monkey Forest", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Bali, Indonesia", 4.5, "nature"),
                    new PlaceResult("30", "Waterbom Bali", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Bali, Indonesia", 4.7, "entertainment")
            );
        }
        // New York - 6 attractions
        else if (location.contains("new york") || location.contains("nyc")) {
            return List.of(
                    new PlaceResult("31", "Statue of Liberty", "https://images.unsplash.com/photo-1548013146-72479768bada?w=800", "New York, USA", 4.8, "tours"),
                    new PlaceResult("32", "Times Square", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800", "New York, USA", 4.7, "entertainment"),
                    new PlaceResult("33", "Central Park", "https://images.unsplash.com/photo-1422255198496-21531f12a6e8?w=800", "New York, USA", 4.6, "nature"),
                    new PlaceResult("34", "Empire State Building", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "New York, USA", 4.5, "tours"),
                    new PlaceResult("35", "Metropolitan Museum", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "New York, USA", 4.9, "museums"),
                    new PlaceResult("36", "Brooklyn Bridge", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "New York, USA", 4.7, "tours")
            );
        }
        // Delhi - 6 attractions
        else if (location.contains("delhi")) {
            return List.of(
                    new PlaceResult("37", "India Gate", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "New Delhi, India", 4.7, "tours"),
                    new PlaceResult("38", "Red Fort", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800", "Old Delhi, India", 4.8, "museums"),
                    new PlaceResult("39", "Qutub Minar", "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800", "Mehrauli, Delhi, India", 4.6, "museums"),
                    new PlaceResult("40", "Lotus Temple", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "New Delhi, India", 4.5, "museums"),
                    new PlaceResult("41", "Akshardham Temple", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "New Delhi, India", 4.9, "museums"),
                    new PlaceResult("42", "Chandni Chowk", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Old Delhi, India", 4.4, "entertainment")
            );
        }
        // Shimla - Enhanced with 6 attractions
        else if (location.contains("shimla")) {
            return List.of(
                    new PlaceResult("43", "The Ridge", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Shimla, Himachal Pradesh", 4.6, "nature"),
                    new PlaceResult("44", "Jakhoo Temple", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Shimla, Himachal Pradesh", 4.5, "museums"),
                    new PlaceResult("45", "Mall Road", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Shimla, Himachal Pradesh", 4.4, "entertainment"),
                    new PlaceResult("46", "Kufri Fun World", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Shimla, Himachal Pradesh", 4.3, "entertainment"),
                    new PlaceResult("47", "Christ Church", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Shimla, Himachal Pradesh", 4.2, "museums"),
                    new PlaceResult("48", "Summer Hill", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Shimla, Himachal Pradesh", 4.5, "nature")
            );
        }
        // Singapore - 6 attractions
        else if (location.contains("singapore")) {
            return List.of(
                    new PlaceResult("49", "Marina Bay Sands", "https://images.unsplash.com/photo-1525625293386-3f8ec9936665?w=800", "Singapore", 4.8, "tours"),
                    new PlaceResult("50", "Gardens by the Bay", "https://images.unsplash.com/photo-1586510913096-ca5ae72b2f6e?w=800", "Singapore", 4.7, "nature"),
                    new PlaceResult("51", "Sentosa Island", "https://images.unsplash.com/photo-1596436883440-4f784ab64583?w=800", "Singapore", 4.6, "entertainment"),
                    new PlaceResult("52", "Universal Studios", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", "Singapore", 4.9, "entertainment"),
                    new PlaceResult("53", "Singapore Zoo", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "Singapore", 4.5, "nature"),
                    new PlaceResult("54", "Merlion Park", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "Singapore", 4.4, "tours")
            );
        }

        // Default for any other location - Enhanced with 6 diverse attractions
        else {
            return List.of(
                    new PlaceResult("55", "City Center Tour", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", searchLocation, 4.5, "tours"),
                    new PlaceResult("56", "Local Museum", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", searchLocation, 4.3, "museums"),
                    new PlaceResult("57", "Scenic Viewpoint", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", searchLocation, 4.7, "nature"),
                    new PlaceResult("58", "Cultural Show", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=800", searchLocation, 4.4, "entertainment"),
                    new PlaceResult("59", "Historic Landmark", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", searchLocation, 4.6, "tours"),
                    new PlaceResult("60", "Botanical Garden", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", searchLocation, 4.2, "nature")
            );
        }
    }
}
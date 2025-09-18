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

        // London
        if (location.contains("london")) {
            return List.of(
                    new PlaceResult("1", "Big Ben", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", "London, UK", 4.7),
                    new PlaceResult("2", "London Eye", "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400", "London, UK", 4.8),
                    new PlaceResult("3", "Tower Bridge", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "London, UK", 4.6)
            );
        }
        // Tokyo
        else if (location.contains("tokyo")) {
            return List.of(
                    new PlaceResult("1", "Tokyo Skytree", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", "Tokyo, Japan", 4.7),
                    new PlaceResult("2", "Senso-ji Temple", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400", "Tokyo, Japan", 4.8),
                    new PlaceResult("3", "Shibuya Crossing", "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=400", "Tokyo, Japan", 4.6)
            );
        }
        // Paris
        else if (location.contains("paris")) {
            return List.of(
                    new PlaceResult("1", "Eiffel Tower", "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400", "Paris, France", 4.7),
                    new PlaceResult("2", "Louvre Museum", "https://images.unsplash.com/photo-1594651691728-82c5d3594277?w=400", "Paris, France", 4.8),
                    new PlaceResult("3", "Notre-Dame Cathedral", "https://images.unsplash.com/photo-1566416800996-ec16e3d683a0?w=400", "Paris, France", 4.6)
            );
        }
        // New York
        else if (location.contains("new york") || location.contains("nyc")) {
            return List.of(
                    new PlaceResult("1", "Statue of Liberty", "https://images.unsplash.com/photo-1548013146-72479768bada?w=400", "New York, USA", 4.7),
                    new PlaceResult("2", "Times Square", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400", "New York, USA", 4.8),
                    new PlaceResult("3", "Central Park", "https://images.unsplash.com/photo-1422255198496-21531f12a6e8?w=400", "New York, USA", 4.6)
            );
        }
        // Delhi
        else if (location.contains("delhi")) {
            return List.of(
                    new PlaceResult("1", "India Gate", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "New Delhi, India", 4.7),
                    new PlaceResult("2", "Red Fort", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400", "Old Delhi, India", 4.8),
                    new PlaceResult("3", "Qutub Minar", "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400", "Mehrauli, Delhi, India", 4.6)
            );
        }

        // Singapore
        else if (location.contains("singapore")) {
            return List.of(
                    new PlaceResult("1", "Marina Bay Sands", "https://images.unsplash.com/photo-1525625293386-3f8ec9936665?w=400", "Singapore", 4.8),
                    new PlaceResult("2", "Gardens by the Bay", "https://images.unsplash.com/photo-1586510913096-ca5ae72b2f6e?w=400", "Singapore", 4.7),
                    new PlaceResult("3", "Sentosa Island", "https://images.unsplash.com/photo-1596436883440-4f784ab64583?w=400", "Singapore", 4.6)
            );
        }
// Istanbul
        else if (location.contains("istanbul")) {
            return List.of(
                    new PlaceResult("1", "Hagia Sophia", "https://images.unsplash.com/photo-1583638704110-830e1266f79e?w=400", "Istanbul, Turkey", 4.8),
                    new PlaceResult("2", "Blue Mosque", "https://images.unsplash.com/photo-1593944331930-25f21a2087f2?w=400", "Istanbul, Turkey", 4.7),
                    new PlaceResult("3", "Grand Bazaar", "https://images.unsplash.com/photo-1589563995467-e09aca3ed9cb?w=400", "Istanbul, Turkey", 4.6)
            );
        }

// Sydney
        else if (location.contains("sydney")) {
            return List.of(
                    new PlaceResult("1", "Sydney Opera House", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", "Sydney, Australia", 4.8),
                    new PlaceResult("2", "Sydney Harbour Bridge", "https://images.unsplash.com/photo-1598948485429-8aca1ab3f7cc?w=400", "Sydney, Australia", 4.7),
                    new PlaceResult("3", "Bondi Beach", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400", "Sydney, Australia", 4.6)
            );
        }
// Rome
        else if (location.contains("rome")) {
            return List.of(
                    new PlaceResult("1", "Colosseum", "https://images.unsplash.com/photo-1552832230-c0197043a4e4?w=400", "Rome, Italy", 4.8),
                    new PlaceResult("2", "Trevi Fountain", "https://images.unsplash.com/photo-1593006622320-980ce49bc1af?w=400", "Rome, Italy", 4.7),
                    new PlaceResult("3", "Vatican City", "https://images.unsplash.com/photo-1592587153622-7e581253b1d7?w=400", "Rome, Italy", 4.9)
            );
        }

        // Amsterdam
        else if (location.contains("amsterdam")) {
            return List.of(
                    new PlaceResult("1", "Anne Frank House", "https://images.unsplash.com/photo-1584555130859-03cce053c6d6?w=400", "Amsterdam, Netherlands", 4.7),
                    new PlaceResult("2", "Van Gogh Museum", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Amsterdam, Netherlands", 4.8),
                    new PlaceResult("3", "Canal Cruise", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "Amsterdam, Netherlands", 4.6)
            );
        }
// Barcelona
        else if (location.contains("barcelona")) {
            return List.of(
                    new PlaceResult("1", "Sagrada Familia", "https://images.unsplash.com/photo-1582445277996-8db3450c54d3?w=400", "Barcelona, Spain", 4.8),
                    new PlaceResult("2", "Park Güell", "https://images.unsplash.com/photo-1559917544-51d7b1d5c5b7?w=400", "Barcelona, Spain", 4.7),
                    new PlaceResult("3", "La Rambla", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Barcelona, Spain", 4.5)
            );
        }
// Berlin
        else if (location.contains("berlin")) {
            return List.of(
                    new PlaceResult("1", "Brandenburg Gate", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Berlin, Germany", 4.7),
                    new PlaceResult("2", "Berlin Wall", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Berlin, Germany", 4.6),
                    new PlaceResult("3", "Reichstag Building", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Berlin, Germany", 4.8)
            );
        }
// Cairo
        else if (location.contains("cairo")) {
            return List.of(
                    new PlaceResult("1", "Pyramids of Giza", "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400", "Cairo, Egypt", 4.9),
                    new PlaceResult("2", "Egyptian Museum", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Cairo, Egypt", 4.6),
                    new PlaceResult("3", "Khan el-Khalili", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Cairo, Egypt", 4.5)
            );
        }
// Hong Kong
        else if (location.contains("hong kong")) {
            return List.of(
                    new PlaceResult("1", "Victoria Peak", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "Hong Kong", 4.8),
                    new PlaceResult("2", "Star Ferry", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Hong Kong", 4.7),
                    new PlaceResult("3", "Temple Street Night Market", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Hong Kong", 4.6)
            );
        }
// Istanbul (already exists, but adding different attractions)
        else if (location.contains("istanbul")) {
            return List.of(
                    new PlaceResult("1", "Hagia Sophia", "https://images.unsplash.com/photo-1583638704110-830e1266f79e?w=400", "Istanbul, Turkey", 4.8),
                    new PlaceResult("2", "Blue Mosque", "https://images.unsplash.com/photo-1593944331930-25f21a2087f2?w=400", "Istanbul, Turkey", 4.7),
                    new PlaceResult("3", "Topkapi Palace", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Istanbul, Turkey", 4.6)
            );
        }
// Jerusalem
        else if (location.contains("jerusalem")) {
            return List.of(
                    new PlaceResult("1", "Western Wall", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Jerusalem, Israel", 4.8),
                    new PlaceResult("2", "Dome of the Rock", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Jerusalem, Israel", 4.7),
                    new PlaceResult("3", "Church of the Holy Sepulchre", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "Jerusalem, Israel", 4.6)
            );
        }
// Lisbon
        else if (location.contains("lisbon")) {
            return List.of(
                    new PlaceResult("1", "Belém Tower", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Lisbon, Portugal", 4.7),
                    new PlaceResult("2", "Jerónimos Monastery", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Lisbon, Portugal", 4.8),
                    new PlaceResult("3", "Alfama District", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "Lisbon, Portugal", 4.6)
            );
        }

// Bangkok
        else if (location.contains("bangkok")) {
            return List.of(
                    new PlaceResult("1", "Grand Palace", "https://images.unsplash.com/photo-1583940099634-4f32bb079e78?w=400", "Bangkok, Thailand", 4.7),
                    new PlaceResult("2", "Wat Arun", "https://images.unsplash.com/photo-1552466852-eb5759325cb0?w=400", "Bangkok, Thailand", 4.6),
                    new PlaceResult("3", "Chatuchak Market", "https://images.unsplash.com/photo-1596771021220-6a806f5379e8?w=400", "Bangkok, Thailand", 4.5)
            );
        }
        // Bali
        else if (location.contains("bali")) {
            return List.of(
                    new PlaceResult("1", "Tanah Lot Temple", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400", "Bali, Indonesia", 4.7),
                    new PlaceResult("2", "Uluwatu Temple", "https://images.unsplash.com/photo-1553659971-f01207815908?w=400", "Bali, Indonesia", 4.8),
                    new PlaceResult("3", "Tegallalang Rice Terraces", "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400", "Bali, Indonesia", 4.6)
            );
        }
        // Dubai
        else if (location.contains("dubai")) {
            return List.of(
                    new PlaceResult("1", "Burj Khalifa", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", "Dubai, UAE", 4.7),
                    new PlaceResult("2", "Palm Jumeirah", "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400", "Dubai, UAE", 4.8),
                    new PlaceResult("3", "Dubai Mall", "https://images.unsplash.com/photo-1582573618381-c9a77c31f6b6?w=400", "Dubai, UAE", 4.6)
            );
        }

        // Mumbai
        else if (location.contains("mumbai")) {
            return List.of(
                    new PlaceResult("1", "Gateway of India", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Mumbai, Maharashtra", 4.7),
                    new PlaceResult("2", "Marine Drive", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Mumbai, Maharashtra", 4.6),
                    new PlaceResult("3", "Elephanta Caves", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Mumbai, Maharashtra", 4.5)
            );
        }
// Delhi (already exists, but adding more attractions)
        else if (location.contains("delhi")) {
            return List.of(
                    new PlaceResult("1", "India Gate", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "New Delhi, India", 4.7),
                    new PlaceResult("2", "Red Fort", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400", "Old Delhi, India", 4.8),
                    new PlaceResult("3", "Lotus Temple", "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400", "New Delhi, India", 4.6),
                    new PlaceResult("4", "Akshardham Temple", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "New Delhi, India", 4.9)
            );
        }
// Bangalore
        else if (location.contains("bangalore") || location.contains("bengaluru")) {
            return List.of(
                    new PlaceResult("1", "Lalbagh Botanical Garden", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Bangalore, Karnataka", 4.6),
                    new PlaceResult("2", "Bangalore Palace", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Bangalore, Karnataka", 4.5),
                    new PlaceResult("3", "Cubbon Park", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400", "Bangalore, Karnataka", 4.7)
            );
        }
// Chennai
        else if (location.contains("chennai") || location.contains("madras")) {
            return List.of(
                    new PlaceResult("1", "Marina Beach", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Chennai, Tamil Nadu", 4.6),
                    new PlaceResult("2", "Kapaleeshwarar Temple", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Chennai, Tamil Nadu", 4.5),
                    new PlaceResult("3", "Fort St. George", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Chennai, Tamil Nadu", 4.4)
            );
        }
// Kolkata
        else if (location.contains("kolkata") || location.contains("calcutta")) {
            return List.of(
                    new PlaceResult("1", "Victoria Memorial", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Kolkata, West Bengal", 4.7),
                    new PlaceResult("2", "Howrah Bridge", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Kolkata, West Bengal", 4.6),
                    new PlaceResult("3", "Dakshineswar Kali Temple", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Kolkata, West Bengal", 4.5)
            );
        }
// Hyderabad
        else if (location.contains("hyderabad")) {
            return List.of(
                    new PlaceResult("1", "Charminar", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Hyderabad, Telangana", 4.7),
                    new PlaceResult("2", "Golconda Fort", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Hyderabad, Telangana", 4.6),
                    new PlaceResult("3", "Ramoji Film City", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Hyderabad, Telangana", 4.8)
            );
        }
// Pune
        else if (location.contains("pune")) {
            return List.of(
                    new PlaceResult("1", "Shaniwar Wada", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Pune, Maharashtra", 4.5),
                    new PlaceResult("2", "Aga Khan Palace", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Pune, Maharashtra", 4.4),
                    new PlaceResult("3", "Sinhagad Fort", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Pune, Maharashtra", 4.6)
            );
        }
// Jaipur
        else if (location.contains("jaipur")) {
            return List.of(
                    new PlaceResult("1", "Hawa Mahal", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Jaipur, Rajasthan", 4.7),
                    new PlaceResult("2", "Amber Fort", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Jaipur, Rajasthan", 4.8),
                    new PlaceResult("3", "City Palace", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Jaipur, Rajasthan", 4.6)
            );
        }
// Ahmedabad
        else if (location.contains("ahmedabad")) {
            return List.of(
                    new PlaceResult("1", "Sabarmati Ashram", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Ahmedabad, Gujarat", 4.6),
                    new PlaceResult("2", "Adalaj Stepwell", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Ahmedabad, Gujarat", 4.5),
                    new PlaceResult("3", "Kankaria Lake", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Ahmedabad, Gujarat", 4.4)
            );
        }
// Goa
        else if (location.contains("goa")) {
            return List.of(
                    new PlaceResult("1", "Baga Beach", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", "Goa", 4.7),
                    new PlaceResult("2", "Basilica of Bom Jesus", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Goa", 4.6),
                    new PlaceResult("3", "Dudhsagar Falls", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Goa", 4.8)
            );
        }
// Agra
        else if (location.contains("agra")) {
            return List.of(
                    new PlaceResult("1", "Taj Mahal", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400", "Agra, Uttar Pradesh", 4.9),
                    new PlaceResult("2", "Agra Fort", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Agra, Uttar Pradesh", 4.7),
                    new PlaceResult("3", "Fatehpur Sikri", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Agra, Uttar Pradesh", 4.6)
            );
        }
// Kerala
        else if (location.contains("kerala") || location.contains("kochi") || location.contains("trivandrum")) {
            return List.of(
                    new PlaceResult("1", "Backwaters of Alleppey", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Kerala", 4.8),
                    new PlaceResult("2", "Munnar Tea Gardens", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Kerala", 4.7),
                    new PlaceResult("3", "Kovalam Beach", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Kerala", 4.6)
            );
        }
// Shimla
        else if (location.contains("shimla")) {
            return List.of(
                    new PlaceResult("1", "The Ridge", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", "Shimla, Himachal Pradesh", 4.6),
                    new PlaceResult("2", "Jakhoo Temple", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", "Shimla, Himachal Pradesh", 4.5),
                    new PlaceResult("3", "Mall Road", "https://images.unsplash.com/photo-1587333607318-46c0e6f74c5b?w=400", "Shimla, Himachal Pradesh", 4.4)
            );
        }

        // Default for any other location
        else {
            return List.of(
                    new PlaceResult("1", "Local Attraction", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400", searchLocation, 4.5),
                    new PlaceResult("2", "Cultural Site", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400", searchLocation, 4.3),
                    new PlaceResult("3", "Scenic Viewpoint", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", searchLocation, 4.7)
            );
        }
    }
}
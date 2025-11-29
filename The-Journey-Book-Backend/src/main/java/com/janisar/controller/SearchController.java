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
                    new PlaceResult("13", "Eiffel Tower", "https://cdn.pixabay.com/photo/2017/09/26/20/13/eiffel-2789943_640.jpg", "Paris, France", 4.8, "tours"),
                    new PlaceResult("14", "Louvre Museum", "https://cdn.pixabay.com/photo/2021/09/04/07/29/louvre-6597169_1280.jpg", "Paris, France", 4.9, "museums"),
                    new PlaceResult("15", "Notre-Dame Cathedral", "https://cdn.pixabay.com/photo/2015/06/05/17/13/notre-dame-798704_640.jpg", "Paris, France", 4.7, "museums"),
                    new PlaceResult("16", "Arc de Triomphe", "https://cdn.pixabay.com/photo/2013/04/07/21/31/arc-de-triomphe-101638_640.jpg", "Paris, France", 4.6, "tours"),
                    new PlaceResult("17", "Montmartre", "https://cdn.pixabay.com/photo/2019/10/13/12/35/paris-4546007_1280.jpg", "Paris, France", 4.5, "tours"),
                    new PlaceResult("18", "Seine River Cruise", "https://cdn.pixabay.com/photo/2022/06/19/11/52/germany-7271696_640.jpg", "Paris, France", 4.7, "entertainment")
            );
        }
        // Dubai - 6 attractions
        else if (location.contains("dubai")) {
            return List.of(
                    new PlaceResult("19", "Burj Khalifa", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "Dubai, UAE", 4.8, "tours"),
                    new PlaceResult("20", "Dubai Mall", "https://cdn.pixabay.com/photo/2017/08/08/15/11/shopping-2611645_640.jpg", "Dubai, UAE", 4.6, "entertainment"),
                    new PlaceResult("21", "Palm Jumeirah", "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800", "Dubai, UAE", 4.7, "tours"),
                    new PlaceResult("22", "Dubai Fountain", "https://cdn.pixabay.com/photo/2022/01/20/21/34/dubai-6953422_640.jpg", "Dubai, UAE", 4.5, "entertainment"),
                    new PlaceResult("23", "Desert Safari", "https://cdn.pixabay.com/photo/2014/12/02/14/11/tree-554045_640.jpg", "Dubai, UAE", 4.9, "nature"),
                    new PlaceResult("24", "Miracle Garden", "https://cdn.pixabay.com/photo/2017/02/17/05/05/gardens-mexico-2073360_640.jpg", "Dubai, UAE", 4.4, "nature")
            );
        }
        // Bali - 6 attractions
        else if (location.contains("bali")) {
            return List.of(
                    new PlaceResult("25", "Tanah Lot Temple", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800", "Bali, Indonesia", 4.7, "museums"),
                    new PlaceResult("26", "Uluwatu Temple", "https://cdn.pixabay.com/photo/2022/04/25/05/48/rain-7155121_640.jpg", "Bali, Indonesia", 4.8, "museums"),
                    new PlaceResult("27", "Tegallalang Rice Terraces", "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800", "Bali, Indonesia", 4.6, "nature"),
                    new PlaceResult("28", "Mount Batur Sunrise", "https://cdn.pixabay.com/photo/2022/05/29/00/27/huangshan-7228173_640.jpg", "Bali, Indonesia", 4.9, "nature"),
                    new PlaceResult("29", "Ubud Monkey Forest", "https://cdn.pixabay.com/photo/2023/06/21/08/58/monkey-8078840_640.jpg", "Bali, Indonesia", 4.5, "nature"),
                    new PlaceResult("30", "Waterbom Bali", "https://cdn.pixabay.com/photo/2019/08/01/01/21/surfer-4376412_640.jpg", "Bali, Indonesia", 4.7, "entertainment")
            );
        }
        // New York - 6 attractions
        else if (location.contains("new york") || location.contains("nyc")) {
            return List.of(
                    new PlaceResult("31", "Statue of Liberty", "https://cdn.pixabay.com/photo/2018/01/11/17/55/architecture-3076565_640.jpg", "New York, USA", 4.8, "tours"),
                    new PlaceResult("32", "Times Square", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800", "New York, USA", 4.7, "entertainment"),
                    new PlaceResult("33", "Central Park", "https://cdn.pixabay.com/photo/2021/08/21/20/21/central-park-6563522_640.jpg", "New York, USA", 4.6, "nature"),
                    new PlaceResult("34", "Empire State Building", "https://cdn.pixabay.com/photo/2020/10/23/06/23/city-5677823_640.jpg", "New York, USA", 4.5, "tours"),
                    new PlaceResult("35", "Metropolitan Museum", "https://cdn.pixabay.com/photo/2025/01/17/16/06/building-9340309_640.jpg", "New York, USA", 4.9, "museums"),
                    new PlaceResult("36", "Brooklyn Bridge", "https://cdn.pixabay.com/photo/2016/10/28/16/43/usa-1778564_640.jpg", "New York, USA", 4.7, "tours")
            );
        }
        // Delhi - 6 attractions
        else if (location.contains("delhi")) {
            return List.of(
                    new PlaceResult("37", "India Gate", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "New Delhi, India", 4.7, "tours"),
                    new PlaceResult("38", "Red Fort", "https://cdn.pixabay.com/photo/2022/04/13/13/55/india-7130382_640.jpg", "Old Delhi, India", 4.8, "museums"),
                    new PlaceResult("39", "Qutub Minar", "https://cdn.pixabay.com/photo/2014/07/01/17/44/qutb-minar-381473_640.jpg", "Mehrauli, Delhi, India", 4.6, "museums"),
                    new PlaceResult("40", "Lotus Temple", "https://cdn.pixabay.com/photo/2023/07/22/19/01/lotus-8143968_640.jpg", "New Delhi, India", 4.5, "museums"),
                    new PlaceResult("41", "Akshardham Temple", "https://cdn.pixabay.com/photo/2023/06/29/09/52/angkor-thom-8096092_640.jpg", "New Delhi, India", 4.9, "museums"),
                    new PlaceResult("42", "Chandni Chowk", "https://cdn.pixabay.com/photo/2018/01/30/12/11/street-life-3118639_640.jpg", "Old Delhi, India", 4.4, "entertainment")
            );
        }
        // Shimla - Enhanced with 6 attractions
        else if (location.contains("shimla")) {
            return List.of(
                    new PlaceResult("43", "The Ridge", "https://cdn.pixabay.com/photo/2014/12/03/22/03/shimla-555906_640.jpg", "Shimla, Himachal Pradesh", 4.6, "nature"),
                    new PlaceResult("44", "Jakhoo Temple", "https://cdn.pixabay.com/photo/2018/05/15/17/25/shimla-3403683_640.jpg", "Shimla, Himachal Pradesh", 4.5, "museums"),
                    new PlaceResult("45", "Mall Road", "https://cdn.pixabay.com/photo/2022/09/21/03/34/thailand-7469405_640.jpg", "Shimla, Himachal Pradesh", 4.4, "entertainment"),
                    new PlaceResult("46", "Kufri Fun World", "https://cdn.pixabay.com/photo/2016/07/04/01/44/mountain-world-1495832_640.jpg", "Shimla, Himachal Pradesh", 4.3, "entertainment"),
                    new PlaceResult("47", "Christ Church", "https://cdn.pixabay.com/photo/2017/07/25/22/16/church-2539749_640.jpg", "Shimla, Himachal Pradesh", 4.2, "museums"),
                    new PlaceResult("48", "Summer Hill", "https://cdn.pixabay.com/photo/2024/03/05/19/43/mountains-8615203_640.jpg", "Shimla, Himachal Pradesh", 4.5, "nature")
            );
        }
        // Singapore - 6 attractions
        else if (location.contains("singapore")) {
            return List.of(
                    new PlaceResult("49", "Marina Bay Sands", "https://cdn.pixabay.com/photo/2012/12/27/19/40/marina-bay-sands-72817_640.jpg", "Singapore", 4.8, "tours"),
                    new PlaceResult("50", "Gardens by the Bay", "https://cdn.pixabay.com/photo/2020/02/21/23/30/singapore-gardens-by-the-bay-4869019_640.jpg", "Singapore", 4.7, "nature"),
                    new PlaceResult("51", "Sentosa Island", "https://cdn.pixabay.com/photo/2017/11/26/12/33/boats-2978737_640.jpg", "Singapore", 4.6, "entertainment"),
                    new PlaceResult("52", "Universal Studios", "https://cdn.pixabay.com/photo/2018/10/27/20/59/hogwarts-3777461_640.jpg", "Singapore", 4.9, "entertainment"),
                    new PlaceResult("53", "Singapore Zoo", "https://cdn.pixabay.com/photo/2020/04/29/09/20/airport-5108010_640.jpg", "Singapore", 4.5, "nature"),
                    new PlaceResult("54", "Merlion Park", "https://cdn.pixabay.com/photo/2023/12/02/20/08/ferris-wheel-8426414_640.jpg", "Singapore", 4.4, "tours")
            );
        }
        // Mumbai
        else if (location.contains("mumbai")) {
            return List.of(
                    new PlaceResult("101","Gateway of India","https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Historical_Gateway_Of_India.jpg/960px-Historical_Gateway_Of_India.jpg","Mumbai, India",4.8,"tours"),
                    new PlaceResult("102","Marine Drive","https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mumbai_Skyline_Marine_Drive_Night.jpg/330px-Mumbai_Skyline_Marine_Drive_Night.jpg","Mumbai, India",4.7,"nature"),
                    new PlaceResult("103","Bandra-Worli Sea Link","https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/The_Bridge_In_Mumbai_%28bandra_worli_sea_link%29.jpg/960px-The_Bridge_In_Mumbai_%28bandra_worli_sea_link%29.jpg","Mumbai, India",4.7,"tours"),
                    new PlaceResult("104","Chhatrapati Shivaji Maharaj Terminus","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chhatrapati_Shivaji_Maharaj_Terminus_%28CSMT%29.jpg/500px-Chhatrapati_Shivaji_Maharaj_Terminus_%28CSMT%29.jpg","Mumbai, India",4.8,"museums"),
                    new PlaceResult("105","Juhu Beach","https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Juhu_Beach%2C_Mumbai_sunset_in_October_2017.jpg/960px-Juhu_Beach%2C_Mumbai_sunset_in_October_2017.jpg","Mumbai, India",4.6,"nature"),
                    new PlaceResult("106","Elephanta Caves","https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephanta_Caves_entrance.jpg/960px-Elephanta_Caves_entrance.jpg","Mumbai, India",4.7,"museums")
            );
        }

// Kolkata
        else if (location.contains("kolkata")) {
            return List.of(
                    new PlaceResult("119","Howrah Bridge","https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Howrah_Bridge%2C_Kolkata%2C_West_Bengal.jpg/1024px-Howrah_Bridge%2C_Kolkata%2C_West_Bengal.jpg","Kolkata, India",4.8,"tours"),
                    new PlaceResult("120","Victoria Memorial","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Victoria_memorial_kolkata_india.jpg/960px-Victoria_memorial_kolkata_india.jpg","Kolkata, India",4.9,"museums"),
                    new PlaceResult("121","Dakshineswar Kali Temple","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Dakshineswar_Kali_Temple_%28Mandir%29%2C_Kolkata.jpg/500px-Dakshineswar_Kali_Temple_%28Mandir%29%2C_Kolkata.jpg","Kolkata, India",4.8,"tours"),
                    new PlaceResult("122","Indian Museum","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Indian_Museum_Kolkata_1529.jpg/960px-Indian_Museum_Kolkata_1529.jpg","Kolkata, India",4.7,"museums"),
                    new PlaceResult("123","Belur Math","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Belur_Math.JPG/960px-Belur_Math.JPG","Howrah (Kolkata), India",4.8,"museums"),
                    new PlaceResult("124","Prinsep Ghat","https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Princep_Ghat%2C_Kolkata%2C_India.JPG/960px-Princep_Ghat%2C_Kolkata%2C_India.JPG","Kolkata, India",4.6,"tours")
            );
        }

// Chennai
        else if (location.contains("chennai")) {
            return List.of(
                    new PlaceResult("113","Marina Beach","https://cdn.pixabay.com/photo/2020/05/18/15/43/marina-beach-5187052_1280.jpg","Chennai, India",4.7,"nature"),
                    new PlaceResult("114","Kapaleeshwarar Temple","https://cdn.pixabay.com/photo/2017/05/18/21/51/chennai-2324861_1280.jpg","Chennai, India",4.8,"museums"),
                    new PlaceResult("115","Fort St. George","https://cdn.pixabay.com/photo/2017/03/03/20/17/india-2114847_1280.jpg","Chennai, India",4.6,"museums"),
                    new PlaceResult("116","Valluvar Kottam","https://cdn.pixabay.com/photo/2017/03/03/20/17/india-2114847_1280.jpg","Chennai, India",4.4,"tours"),
                    new PlaceResult("117","Government Museum","https://upload.wikimedia.org/wikipedia/commons/7/71/Government_Museum_Chennai.jpg","Chennai, India",4.5,"museums"),
                    new PlaceResult("118","Guindy National Park","https://upload.wikimedia.org/wikipedia/commons/8/8c/Deer_at_Guindy_Childrens_Park%2C_Chennai._-_panoramio.jpg","Chennai, India",4.3,"nature")
            );
        }

// Jaipur
        else if (location.contains("jaipur")) {
            return List.of(
                    new PlaceResult("119", "Hawa Mahal", "https://images.unsplash.com/photo-1611629097579-b4bfe7f56019?w=800", "Jaipur, India", 4.9, "tours"),
                    new PlaceResult("120", "Amber Fort", "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800", "Jaipur, India", 4.8, "museums"),
                    new PlaceResult("121", "City Palace", "https://images.unsplash.com/photo-1616696363001-895c3e1a5f85?w=800", "Jaipur, India", 4.7, "museums"),
                    new PlaceResult("122", "Jantar Mantar", "https://images.unsplash.com/photo-1694549168659-2c7545260793?w=800", "Jaipur, India", 4.6, "museums"),
                    new PlaceResult("123", "Nahargarh Fort", "https://images.unsplash.com/photo-1661933551258-b092287f2d79?w=800", "Jaipur, India", 4.7, "tours"),
                    new PlaceResult("124", "Jal Mahal", "https://images.unsplash.com/photo-1615224288524-fbc32f735931?w=800", "Jaipur, India", 4.8, "tours")
            );
        }
// Agra
        else if (location.contains("agra")) {
            return List.of(
                    new PlaceResult("125", "Taj Mahal", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800", "Agra, India", 5.0, "museums"),
                    new PlaceResult("126", "Agra Fort", "https://images.unsplash.com/photo-1710336017304-ba11aad6ad64?w=800", "Agra, India", 4.8, "museums"),
                    new PlaceResult("127", "Mehtab Bagh", "https://images.unsplash.com/photo-1715559860222-6b44a2e8bf61?w=800", "Agra, India", 4.7, "nature"),
                    new PlaceResult("128", "Fatehpur Sikri", "https://images.unsplash.com/photo-1717576425796-30be3f0665d0?w=800", "Agra, India", 4.8, "museums"),
                    new PlaceResult("129", "Akbar’s Tomb", "https://images.unsplash.com/photo-1697799781971-016ebda30f83?w=800", "Agra, India", 4.5, "museums"),
                    new PlaceResult("130", "Kinari Bazaar", "https://images.unsplash.com/photo-1642622596432-b7dab1dcf3af?w=800", "Agra, India", 4.3, "entertainment")
            );
        }
// Varanasi
        else if (location.contains("varanasi")) {
            return List.of(
                    new PlaceResult("131", "Kashi Vishwanath Temple", "https://images.unsplash.com/photo-1548013146-9ec09f06c2c1?w=800", "Varanasi, India", 4.9, "museums"),
                    new PlaceResult("132", "Dashashwamedh Ghat", "https://images.unsplash.com/photo-1614502689120-8fc1ec8ba163?w=800", "Varanasi, India", 4.8, "tours"),
                    new PlaceResult("133", "Assi Ghat", "https://images.unsplash.com/photo-1717240567702-12bbdceb4455?w=800", "Varanasi, India", 4.7, "nature"),
                    new PlaceResult("134", "Manikarnika Ghat", "https://images.unsplash.com/photo-1619447664218-f8a535a4d6c2?w=800", "Varanasi, India", 4.6, "museums"),
                    new PlaceResult("135", "Banaras Hindu University", "https://images.unsplash.com/photo-1709221836450-0ec61a86342d?w=800", "Varanasi, India", 4.5, "museums"),
                    new PlaceResult("136", "Sarnath", "https://images.unsplash.com/photo-1646995086901-2ecc3c979b93?w=800", "Varanasi, India", 4.8, "museums")
            );
        }
// Hyderabad
        else if (location.contains("hyderabad")) {
            return List.of(
                    new PlaceResult("137", "Charminar", "https://images.unsplash.com/photo-1580694478164-cb4276ec81f7?w=800", "Hyderabad, India", 4.8, "tours"),
                    new PlaceResult("138", "Golconda Fort", "https://images.unsplash.com/photo-1589641088148-06b1a4570790?w=800", "Hyderabad, India", 4.7, "museums"),
                    new PlaceResult("139", "Hussain Sagar Lake", "https://images.unsplash.com/photo-1606011428400-cb26cc9c1a50?w=800", "Hyderabad, India", 4.6, "nature"),
                    new PlaceResult("140", "Birla Mandir", "https://images.unsplash.com/photo-1694516696617-32bc1e5b9fc5?w=800", "Hyderabad, India", 4.7, "museums"),
                    new PlaceResult("141", "Ramoji Film City", "https://images.unsplash.com/photo-1706250963544-01f38eae5b43?w=800", "Hyderabad, India", 4.9, "entertainment"),
                    new PlaceResult("142", "Salar Jung Museum", "https://images.unsplash.com/photo-1700057649123-90e64d13f8cf?w=800", "Hyderabad, India", 4.8, "museums")
            );
        }


        // Default for any other location - Enhanced with 6 diverse attractions
        else {
            return List.of(
                    new PlaceResult("55", "City Center Tour", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", searchLocation, 4.5, "tours"),
                    new PlaceResult("56", "Local Museum", "https://cdn.pixabay.com/photo/2020/12/09/21/11/stairs-5818603_640.jpg", searchLocation, 4.3, "museums"),
                    new PlaceResult("57", "Scenic Viewpoint", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", searchLocation, 4.7, "nature"),
                    new PlaceResult("58", "Cultural Show", "https://cdn.pixabay.com/photo/2017/10/25/20/34/khon-2889163_640.jpg", searchLocation, 4.4, "entertainment"),
                    new PlaceResult("59", "Historic Landmark", "https://cdn.pixabay.com/photo/2021/07/24/15/47/venice-6489813_640.jpg", searchLocation, 4.6, "tours"),
                    new PlaceResult("60", "Botanical Garden", "https://cdn.pixabay.com/photo/2022/08/06/15/16/grapevine-7368800_640.jpg", searchLocation, 4.2, "nature"),
                    new PlaceResult("61", "Food Market Tour", "https://cdn.pixabay.com/photo/2020/08/09/11/24/fish-5475257_640.jpg", searchLocation, 4.8, "entertainment"),
                    new PlaceResult("62", "River Cruise", "https://cdn.pixabay.com/photo/2022/03/21/14/18/boats-7083304_640.jpg", searchLocation, 4.5, "tours"),
                    new PlaceResult("63", "Art Gallery", "https://cdn.pixabay.com/photo/2014/01/14/22/33/art-gallery-245251_640.jpg", searchLocation, 4.4, "museums"),
                    new PlaceResult("64", "Mountain Hiking", "https://cdn.pixabay.com/photo/2022/02/13/15/59/river-7011476_640.jpg", searchLocation, 4.9, "nature"),
                    new PlaceResult("65", "Traditional Workshop", "https://cdn.pixabay.com/photo/2019/09/26/14/23/vice-4506104_640.jpg", searchLocation, 4.6, "entertainment"),
                    new PlaceResult("66", "Sunset Photography Tour", "https://cdn.pixabay.com/photo/2020/10/07/10/51/mountains-5634817_640.jpg", searchLocation, 4.7, "tours"),
                    new PlaceResult("67", "Local Craft Brewery", "https://cdn.pixabay.com/photo/2017/06/24/23/41/beer-2439237_1280.jpg", searchLocation, 4.3, "entertainment"),
                    new PlaceResult("68", "Ancient Ruins Exploration", "https://cdn.pixabay.com/photo/2018/10/14/13/01/ruin-3746423_640.jpg", searchLocation, 4.8, "museums"),
                    new PlaceResult("69", "Wildlife Safari", "https://cdn.pixabay.com/photo/2017/10/20/10/58/elephant-2870777_1280.jpg", searchLocation, 4.9, "nature"),
                    new PlaceResult("70", "Cooking Class Experience", "https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_640.jpg", searchLocation, 4.6, "entertainment"),
                    new PlaceResult("71", "Night City Tour", "https://cdn.pixabay.com/photo/2021/07/30/08/21/street-6509043_640.jpg", searchLocation, 4.5, "tours"),
                    new PlaceResult("73", "Historic Castle Visit", "https://cdn.pixabay.com/photo/2015/11/26/12/45/garden-1063833_640.jpg", searchLocation, 4.7, "museums"),
                    new PlaceResult("74", "Beach Day Experience", "https://cdn.pixabay.com/photo/2023/03/29/17/50/beach-7886067_640.jpg", searchLocation, 4.6, "nature"),
                    new PlaceResult("75", "Street Art Walking Tour", "https://cdn.pixabay.com/photo/2023/09/01/19/09/couple-8227550_640.jpg", searchLocation, 4.4, "tours")
            );
        }
    }
}
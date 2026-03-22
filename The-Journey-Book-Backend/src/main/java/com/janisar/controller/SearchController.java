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
                    new PlaceResult("1", "Tokyo Skytree", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", "Tokyo, Japan", 4.7, "tours",0),
                    new PlaceResult("2", "Senso-ji Temple", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", "Tokyo, Japan", 4.8, "museums",70),
                    new PlaceResult("3", "Shibuya Crossing", "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=800", "Tokyo, Japan", 4.6, "entertainment",50),
                    new PlaceResult("4", "Meiji Shrine", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", "Tokyo, Japan", 4.5, "nature",0), // Using Senso-ji image as fallback
                    new PlaceResult("5", "Tokyo National Museum", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Main_building_of_the_Tokyo_National_Museum.jpg/960px-Main_building_of_the_Tokyo_National_Museum.jpg?20210724050315", "Tokyo, Japan", 4.4, "museums",60),
                    new PlaceResult("6", "Ueno Park", "https://media1.thrillophilia.com/filestore/8o5jyhna9ru9xy9y7sldofr24dgf_Ueno%20park%20(1).jpg?w=1440&dpr=2", "Tokyo, Japan", 4.3, "nature",0)            );
        }
        // London - Enhanced with 6 attractions
        else if (location.contains("london")) {
            return List.of(
                    new PlaceResult("7", "Big Ben", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "London, UK", 4.7, "tours",0),
                    new PlaceResult("8", "London Eye", "https://c.pxhere.com/photos/92/e9/london_ferris_wheel_streetlight_bro_london_eye_england_blue_sky_cloud-802337.jpg!d", "London, UK", 4.8, "tours",0),
                    new PlaceResult("9", "Tower Bridge", "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800", "London, UK", 4.6, "tours",0),
                    new PlaceResult("10", "British Museum", "https://cdn.pixabay.com/photo/2013/08/15/14/15/london-172794_640.jpg", "London, UK", 4.9, "museums",70),
                    new PlaceResult("11", "Buckingham Palace", "https://cdn.pixabay.com/photo/2016/12/26/13/31/london-1932142_640.jpg", "London, UK", 4.5, "tours",0),
                    new PlaceResult("12", "Hyde Park", "https://cdn.pixabay.com/photo/2015/08/15/23/45/houses-890351_640.jpg", "London, UK", 4.4, "nature",0)
            );
        }
        // Paris - 6 attractions
        else if (location.contains("paris")) {
            return List.of(
                    new PlaceResult("13", "Eiffel Tower", "https://cdn.pixabay.com/photo/2017/09/26/20/13/eiffel-2789943_640.jpg", "Paris, France", 4.8, "tours",0),
                    new PlaceResult("14", "Louvre Museum", "https://cdn.pixabay.com/photo/2021/09/04/07/29/louvre-6597169_1280.jpg", "Paris, France", 4.9, "museums",60),
                    new PlaceResult("15", "Notre-Dame Cathedral", "https://cdn.pixabay.com/photo/2015/06/05/17/13/notre-dame-798704_640.jpg", "Paris, France", 4.7, "museums",70),
                    new PlaceResult("16", "Arc de Triomphe", "https://cdn.pixabay.com/photo/2013/04/07/21/31/arc-de-triomphe-101638_640.jpg", "Paris, France", 4.6, "tours",0),
                    new PlaceResult("17", "Montmartre", "https://cdn.pixabay.com/photo/2019/10/13/12/35/paris-4546007_1280.jpg", "Paris, France", 4.5, "tours",0),
                    new PlaceResult("18", "Seine River Cruise", "https://cdn.pixabay.com/photo/2022/06/19/11/52/germany-7271696_640.jpg", "Paris, France", 4.7, "entertainment",40)
            );
        }
        // Dubai - 6 attractions
        else if (location.contains("dubai")) {
            return List.of(
                    new PlaceResult("19", "Burj Khalifa", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "Dubai, UAE", 4.8, "tours",0),
                    new PlaceResult("20", "Dubai Mall", "https://cdn.pixabay.com/photo/2017/08/08/15/11/shopping-2611645_640.jpg", "Dubai, UAE", 4.6, "entertainment",60),
                    new PlaceResult("21", "Palm Jumeirah", "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800", "Dubai, UAE", 4.7, "tours",0),
                    new PlaceResult("22", "Dubai Fountain", "https://cdn.pixabay.com/photo/2022/01/20/21/34/dubai-6953422_640.jpg", "Dubai, UAE", 4.5, "entertainment",50),
                    new PlaceResult("23", "Desert Safari", "https://cdn.pixabay.com/photo/2014/12/02/14/11/tree-554045_640.jpg", "Dubai, UAE", 4.9, "nature",0),
                    new PlaceResult("24", "Miracle Garden", "https://cdn.pixabay.com/photo/2017/02/17/05/05/gardens-mexico-2073360_640.jpg", "Dubai, UAE", 4.4, "nature",0)
            );
        }
        // Bali - 6 attractions
        else if (location.contains("bali")) {
            return List.of(
                    new PlaceResult("25", "Tanah Lot Temple", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800", "Bali, Indonesia", 4.7, "museums",80),
                    new PlaceResult("26", "Uluwatu Temple", "https://cdn.pixabay.com/photo/2022/04/25/05/48/rain-7155121_640.jpg", "Bali, Indonesia", 4.8, "museums",70),
                    new PlaceResult("27", "Tegallalang Rice Terraces", "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800", "Bali, Indonesia", 4.6, "nature",0),
                    new PlaceResult("28", "Mount Batur Sunrise", "https://cdn.pixabay.com/photo/2022/05/29/00/27/huangshan-7228173_640.jpg", "Bali, Indonesia", 4.9, "nature",0),
                    new PlaceResult("29", "Ubud Monkey Forest", "https://cdn.pixabay.com/photo/2023/06/21/08/58/monkey-8078840_640.jpg", "Bali, Indonesia", 4.5, "nature",0),
                    new PlaceResult("30", "Waterbom Bali", "https://cdn.pixabay.com/photo/2019/08/01/01/21/surfer-4376412_640.jpg", "Bali, Indonesia", 4.7, "entertainment",60)
            );
        }
        // New York - 6 attractions
        else if (location.contains("new york") || location.contains("nyc")) {
            return List.of(
                    new PlaceResult("31", "Statue of Liberty", "https://cdn.pixabay.com/photo/2018/01/11/17/55/architecture-3076565_640.jpg", "New York, USA", 4.8, "tours",0),
                    new PlaceResult("32", "Times Square", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800", "New York, USA", 4.7, "entertainment",80),
                    new PlaceResult("33", "Central Park", "https://cdn.pixabay.com/photo/2021/08/21/20/21/central-park-6563522_640.jpg", "New York, USA", 4.6, "nature",0),
                    new PlaceResult("34", "Empire State Building", "https://cdn.pixabay.com/photo/2020/10/23/06/23/city-5677823_640.jpg", "New York, USA", 4.5, "tours",0),
                    new PlaceResult("35", "Metropolitan Museum", "https://cdn.pixabay.com/photo/2025/01/17/16/06/building-9340309_640.jpg", "New York, USA", 4.9, "museums",120),
                    new PlaceResult("36", "Brooklyn Bridge", "https://cdn.pixabay.com/photo/2016/10/28/16/43/usa-1778564_640.jpg", "New York, USA", 4.7, "tours",0)
            );
        }
        // Delhi - 6 attractions
        else if (location.contains("delhi")) {
            return List.of(
                    new PlaceResult("37", "India Gate", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800", "New Delhi, India", 4.7, "tours",0),
                    new PlaceResult("38", "Red Fort", "https://cdn.pixabay.com/photo/2022/04/13/13/55/india-7130382_640.jpg", "Old Delhi, India", 4.8, "museums",50),
                    new PlaceResult("39", "Qutub Minar", "https://cdn.pixabay.com/photo/2014/07/01/17/44/qutb-minar-381473_640.jpg", "Mehrauli, Delhi, India", 4.6, "museums",50),
                    new PlaceResult("40", "Lotus Temple", "https://cdn.pixabay.com/photo/2023/07/22/19/01/lotus-8143968_640.jpg", "New Delhi, India", 4.5, "museums",60),
                    new PlaceResult("41", "Akshardham Temple", "https://cdn.pixabay.com/photo/2023/06/29/09/52/angkor-thom-8096092_640.jpg", "New Delhi, India", 4.9, "museums",40),
                    new PlaceResult("42", "Chandni Chowk", "https://cdn.pixabay.com/photo/2018/01/30/12/11/street-life-3118639_640.jpg", "Old Delhi, India", 4.4, "entertainment",40)
            );
        }
        // Shimla - Enhanced with 6 attractions
        else if (location.contains("shimla")) {
            return List.of(
                    new PlaceResult("43", "The Ridge", "https://cdn.pixabay.com/photo/2014/12/03/22/03/shimla-555906_640.jpg", "Shimla, Himachal Pradesh", 4.6, "nature",0),
                    new PlaceResult("44", "Jakhoo Temple", "https://cdn.pixabay.com/photo/2018/05/15/17/25/shimla-3403683_640.jpg", "Shimla, Himachal Pradesh", 4.5, "museums",40),
                    new PlaceResult("45", "Mall Road", "https://cdn.pixabay.com/photo/2022/09/21/03/34/thailand-7469405_640.jpg", "Shimla, Himachal Pradesh", 4.4, "entertainment",80),
                    new PlaceResult("46", "Kufri Fun World", "https://cdn.pixabay.com/photo/2016/07/04/01/44/mountain-world-1495832_640.jpg", "Shimla, Himachal Pradesh", 4.3, "entertainment",70),
                    new PlaceResult("47", "Christ Church", "https://cdn.pixabay.com/photo/2017/07/25/22/16/church-2539749_640.jpg", "Shimla, Himachal Pradesh", 4.2, "museums",40),
                    new PlaceResult("48", "Summer Hill", "https://cdn.pixabay.com/photo/2024/03/05/19/43/mountains-8615203_640.jpg", "Shimla, Himachal Pradesh", 4.5, "nature",0)
            );
        }
        // Singapore - 6 attractions
        else if (location.contains("singapore")) {
            return List.of(
                    new PlaceResult("49", "Marina Bay Sands", "https://cdn.pixabay.com/photo/2012/12/27/19/40/marina-bay-sands-72817_640.jpg", "Singapore", 4.8, "tours",0),
                    new PlaceResult("50", "Gardens by the Bay", "https://cdn.pixabay.com/photo/2020/02/21/23/30/singapore-gardens-by-the-bay-4869019_640.jpg", "Singapore", 4.7, "nature",0),
                    new PlaceResult("51", "Sentosa Island", "https://cdn.pixabay.com/photo/2017/11/26/12/33/boats-2978737_640.jpg", "Singapore", 4.6, "entertainment",40),
                    new PlaceResult("52", "Universal Studios", "https://cdn.pixabay.com/photo/2018/10/27/20/59/hogwarts-3777461_640.jpg", "Singapore", 4.9, "entertainment",50),
                    new PlaceResult("53", "Singapore Zoo", "https://cdn.pixabay.com/photo/2020/04/29/09/20/airport-5108010_640.jpg", "Singapore", 4.5, "nature",0),
                    new PlaceResult("54", "Merlion Park", "https://cdn.pixabay.com/photo/2023/12/02/20/08/ferris-wheel-8426414_640.jpg", "Singapore", 4.4, "tours",0)
            );
        }
        // Mumbai
        else if (location.contains("mumbai")) {
            return List.of(
                    new PlaceResult("101","Gateway of India","https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Historical_Gateway_Of_India.jpg/960px-Historical_Gateway_Of_India.jpg","Mumbai, India",4.8,"tours",0),
                    new PlaceResult("102","Marine Drive","https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mumbai_Skyline_Marine_Drive_Night.jpg/330px-Mumbai_Skyline_Marine_Drive_Night.jpg","Mumbai, India",4.7,"nature",0),
                    new PlaceResult("103","Bandra-Worli Sea Link","https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/The_Bridge_In_Mumbai_%28bandra_worli_sea_link%29.jpg/960px-The_Bridge_In_Mumbai_%28bandra_worli_sea_link%29.jpg","Mumbai, India",4.7,"tours",0),
                    new PlaceResult("104","Chhatrapati Shivaji Maharaj Terminus","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chhatrapati_Shivaji_Maharaj_Terminus_%28CSMT%29.jpg/500px-Chhatrapati_Shivaji_Maharaj_Terminus_%28CSMT%29.jpg","Mumbai, India",4.8,"museums",50),
                    new PlaceResult("105","Juhu Beach","https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Juhu_Beach%2C_Mumbai_sunset_in_October_2017.jpg/960px-Juhu_Beach%2C_Mumbai_sunset_in_October_2017.jpg","Mumbai, India",4.6,"nature",0),
                    new PlaceResult("106","Elephanta Caves","https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephanta_Caves_entrance.jpg/960px-Elephanta_Caves_entrance.jpg","Mumbai, India",4.7,"museums",40)
            );
        }

// Kolkata
        else if (location.contains("kolkata")) {
            return List.of(
                    new PlaceResult("119","Howrah Bridge","https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Howrah_Bridge%2C_Kolkata%2C_West_Bengal.jpg/1024px-Howrah_Bridge%2C_Kolkata%2C_West_Bengal.jpg","Kolkata, India",4.8,"tours",0),
                    new PlaceResult("120","Victoria Memorial","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Victoria_memorial_kolkata_india.jpg/960px-Victoria_memorial_kolkata_india.jpg","Kolkata, India",4.9,"museums",50),
                    new PlaceResult("121","Dakshineswar Kali Temple","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Dakshineswar_Kali_Temple_%28Mandir%29%2C_Kolkata.jpg/500px-Dakshineswar_Kali_Temple_%28Mandir%29%2C_Kolkata.jpg","Kolkata, India",4.8,"tours",0),
                    new PlaceResult("122","Indian Museum","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Indian_Museum_Kolkata_1529.jpg/960px-Indian_Museum_Kolkata_1529.jpg","Kolkata, India",4.7,"museums",40),
                    new PlaceResult("123","Belur Math","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Belur_Math.JPG/960px-Belur_Math.JPG","Howrah (Kolkata), India",4.8,"museums",40),
                    new PlaceResult("124","Prinsep Ghat","https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Princep_Ghat%2C_Kolkata%2C_India.JPG/960px-Princep_Ghat%2C_Kolkata%2C_India.JPG","Kolkata, India",4.6,"tours",0)
            );
        }

// Chennai
        else if (location.contains("chennai")) {
            return List.of(
                    new PlaceResult("113","Marina Beach","https://cdn.pixabay.com/photo/2020/05/18/15/43/marina-beach-5187052_1280.jpg","Chennai, India",4.7,"nature",0),
                    new PlaceResult("114","Kapaleeshwarar Temple","https://cdn.pixabay.com/photo/2017/05/18/21/51/chennai-2324861_1280.jpg","Chennai, India",4.8,"museums",50),
                    new PlaceResult("115","Fort St. George","https://cdn.pixabay.com/photo/2017/03/03/20/17/india-2114847_1280.jpg","Chennai, India",4.6,"museums",60),
                    new PlaceResult("116","Valluvar Kottam","https://cdn.pixabay.com/photo/2017/03/03/20/17/india-2114847_1280.jpg","Chennai, India",4.4,"tours",0),
                    new PlaceResult("117","Government Museum","https://upload.wikimedia.org/wikipedia/commons/7/71/Government_Museum_Chennai.jpg","Chennai, India",4.5,"museums",50),
                    new PlaceResult("118","Guindy National Park","https://upload.wikimedia.org/wikipedia/commons/8/8c/Deer_at_Guindy_Childrens_Park%2C_Chennai._-_panoramio.jpg","Chennai, India",4.3,"nature",0)
            );
        }

// Jaipur
        else if (location.contains("agra")) {
            return List.of(
                    new PlaceResult("131","Taj Mahal","http://upload.wikimedia.org/wikipedia/commons/c/c8/Taj_Mahal_in_March_2004.jpg","Agra, India",4.9,"tours",0),
                    new PlaceResult("132","Agra Fort","https://cdn.pixabay.com/photo/2014/06/29/20/20/agra-fort-379710_640.jpg","Agra, India",4.8,"museums",40),
                    new PlaceResult("133","Taj Marble Detail","https://cdn.pixabay.com/photo/2020/01/08/07/53/architecture-4749511_1280.jpg","Agra, India",4.7,"museums",45),
                    new PlaceResult("134","Fatehpur Sikri","https://cdn.pixabay.com/photo/2013/10/28/10/43/fathepur-sikri-201748_640.jpg","Fatehpur Sikri, India",4.7,"tours",0),
                    new PlaceResult("135","Mehtab Bagh","https://cdn.pixabay.com/photo/2020/01/08/07/53/architecture-4749511_1280.jpg","Agra, India",4.6,"nature",0),
                    new PlaceResult("136","Itmad-ud-Daulah's Tomb","https://cdn.pixabay.com/photo/2014/06/29/20/20/agra-fort-379710_640.jpg","Agra, India",4.5,"museums",50)
            );
        }
        else if (location.contains("jaipur")) {
            return List.of(
                    new PlaceResult("137","Hawa Mahal","https://cdn.pixabay.com/photo/2021/04/06/11/22/hawa-mahal-6156123_1280.jpg","Jaipur, India",4.8,"tours",0),
                    new PlaceResult("138","Jal Mahal","https://cdn.pixabay.com/photo/2019/04/07/07/51/jal-mahal-4109105_1280.jpg","Jaipur, India",4.7,"tours",0),
                    new PlaceResult("139","Jantar Mantar","https://cdn.pixabay.com/photo/2019/10/05/08/53/jantar-mantar-4527397_640.jpg","Jaipur, India",4.6,"museums",50),
                    new PlaceResult("140","City Palace","https://cdn.pixabay.com/photo/2014/09/11/10/13/hawa-mahal-441563_640.jpg","Jaipur, India",4.6,"museums",45),
                    new PlaceResult("141","Nahargarh Fort","https://cdn.pixabay.com/photo/2019/04/07/07/51/jal-mahal-4109105_1280.jpg","Jaipur, India",4.5,"nature",0),
                    new PlaceResult("142","Albert Hall Museum","https://cdn.pixabay.com/photo/2021/04/06/11/22/hawa-mahal-6156123_1280.jpg","Jaipur, India",4.5,"museums",40)
            );
        }

// Varanasi
        else if (location.contains("varanasi")) {
            return List.of(
                    new PlaceResult("143","Kashi Vishwanath Temple","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kashi_Vishwanath_Temple_Main_Area-3.jpg/500px-Kashi_Vishwanath_Temple_Main_Area-3.jpg","Varanasi, India",4.9,"tours",0),
                    new PlaceResult("144","Dashashwamedh Ghat","https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Dashashwamedh_Ghat_Varanasi.jpg/960px-Dashashwamedh_Ghat_Varanasi.jpg","Varanasi, India",4.8,"tours",0),
                    new PlaceResult("145","Assi Ghat","https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Assi_Ghat_Varanasi.jpg/960px-Assi_Ghat_Varanasi.jpg","Varanasi, India",4.7,"tours",0),
                    new PlaceResult("146","Sarnath – Dhamek Stupa","https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Dhamek_Stupa%2C_Sarnath.jpg/500px-Dhamek_Stupa%2C_Sarnath.jpg","Sarnath, India",4.8,"museums",55),
                    new PlaceResult("147","BHU Main Gate","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/BHU_Main_Gate%2C_Banaras_Hindu_University_enhanced.jpg/800px-BHU_Main_Gate%2C_Banaras_Hindu_University_enhanced.jpg","Varanasi, India",4.6,"tours",0),
                    new PlaceResult("148","Manikarnika Ghat","https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh.jpg/500px-Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh.jpg","Varanasi, India",4.7,"tours",0)
            );
        }
        else if (location.contains("hyderabad")) {
            return List.of(
                    new PlaceResult("149","Charminar","https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hyderabad%2C_charminar_01.jpg/500px-Hyderabad%2C_charminar_01.jpg","Hyderabad, India",4.8,"tours",0),
                    new PlaceResult("150","Golconda Fort","https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/00-Golconda-Fort-Hyderabad_48.jpg/960px-00-Golconda-Fort-Hyderabad_48.jpg","Hyderabad, India",4.7,"tours",0),
                    new PlaceResult("151","Hussain Sagar Buddha Statue","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Buddha_in_Hussain_sagar.jpg/960px-Buddha_in_Hussain_sagar.jpg","Hyderabad, India",4.7,"tours",0),
                    new PlaceResult("152","Ramoji Film City","https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Ramoji_Film_City_-_A_view_from_the_entrance_3145.JPG/960px-Ramoji_Film_City_-_A_view_from_the_entrance_3145.JPG","Hyderabad, India",4.8,"entertainment",40),
                    new PlaceResult("153","Birla Mandir","https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Birla_Mandir_in_Hyderabad%2C_2015.JPG/960px-Birla_Mandir_in_Hyderabad%2C_2015.JPG","Hyderabad, India",4.6,"museums",50),
                    new PlaceResult("154","Chowmahalla Palace","https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Chowmahalla_Palace_-_Northern_Courtyard_%284%29.jpg/960px-Chowmahalla_Palace_-_Northern_Courtyard_%284%29.jpg","Hyderabad, India",4.7,"museums",60)
            );
        }

        else if (location.contains("lucknow")) {
            return List.of(
                    new PlaceResult("155","Bara Imambara","https://commons.wikimedia.org/wiki/Special:FilePath/Bara_Imambara_Lucknow.jpg","Lucknow, India",4.8,"tours",0),
                    new PlaceResult("156","Rumi Darwaza","https://commons.wikimedia.org/wiki/Special:FilePath/Rumi_Gate_Lucknow.jpg","Lucknow, India",4.7,"tours",0),
                    new PlaceResult("157","Chota Imambara","https://commons.wikimedia.org/wiki/Special:FilePath/Chota_Imambara.JPG","Lucknow, India",4.6,"museums",40),
                    new PlaceResult("158","Hazratganj Market","https://commons.wikimedia.org/wiki/Special:FilePath/Hazratganj_Market,_Lucknow_(8716416603).jpg","Lucknow, India",4.7,"entertainment",50),
                    new PlaceResult("159","Ambedkar Memorial Park","https://commons.wikimedia.org/wiki/Special:FilePath/Ambedkar_Memorial_Park,_Gomti_Nagar,_Lucknow,_Uttar_Pradesh,_India_(2018).jpg","Lucknow, India",4.6,"nature",0),
                    new PlaceResult("160","Gomti Riverfront","https://commons.wikimedia.org/wiki/Special:FilePath/Gomti_River_Front_6.jpg","Lucknow, India",4.5,"nature",0)
            );
        }


        else if (location.contains("bengaluru") || location.contains("bangalore")) {
            return List.of(
                    new PlaceResult("161","Vidhana Soudha","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Vidhana_Soudha_%2C_the_State_Legistlature_of_Karnataka%2C_Bengaluru%2C_India.jpg/960px-Vidhana_Soudha_%2C_the_State_Legistlature_of_Karnataka%2C_Bengaluru%2C_India.jpg","Bengaluru, India",4.8,"tours",0),
                    new PlaceResult("162","Bangalore Palace","https://upload.wikimedia.org/wikipedia/commons/1/12/Bangalore_Palace.jpg","Bengaluru, India",4.7,"museums",50),
                    new PlaceResult("163","Cubbon Park","https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cubbon_Park%2C_Bangalore_%28TuckDB_Postcard%29.jpg/960px-Cubbon_Park%2C_Bangalore_%28TuckDB_Postcard%29.jpg","Bengaluru, India",4.6,"nature",0),
                    new PlaceResult("164","Lalbagh Glasshouse","https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Lalbagh_Glasshouse_night_panorama.jpg/960px-Lalbagh_Glasshouse_night_panorama.jpg","Bengaluru, India",4.7,"nature",0),
                    new PlaceResult("165","ISKCON Temple","https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ISKCON_Temple_-_Bangalore_-_Karnataka_-_DSCN0101.jpg/960px-ISKCON_Temple_-_Bangalore_-_Karnataka_-_DSCN0101.jpg","Bengaluru, India",4.8,"tours",0),
                    new PlaceResult("166","UB City","https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/UB_City%2C_Bangalore.JPG/960px-UB_City%2C_Bangalore.JPG","Bengaluru, India",4.6,"entertainment",35)
            );
        }

        else if (location.contains("ahmedabad")) {
            return List.of(
                    new PlaceResult("167","Sabarmati Riverfront","https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sabarmati_Riverfront_in_Ahmedabad.jpg/960px-Sabarmati_Riverfront_in_Ahmedabad.jpg","Ahmedabad, India",4.8,"tours",0),
                    new PlaceResult("168","Sabarmati Ashram","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Sabarmati-Ashram-1.jpg/1024px-Sabarmati-Ashram-1.jpg","Ahmedabad, India",4.8,"museums",40),
                    new PlaceResult("169","Sidi Saiyyed Mosque","https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_-_Jali_Work.jpg/960px-Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_-_Jali_Work.jpg","Ahmedabad, India",4.7,"museums",45),
                    new PlaceResult("170","Adalaj Stepwell","https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Adalaj_Stepwell%2C_Ahmedabad%2C_Gujarat%2C_India.jpg/960px-Adalaj_Stepwell%2C_Ahmedabad%2C_Gujarat%2C_India.jpg","Adalaj, India",4.7,"tours",0),
                    new PlaceResult("171","Kankaria Lake","https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Kankaria_Lake_at_Ahmedabad.JPG/960px-Kankaria_Lake_at_Ahmedabad.JPG","Ahmedabad, India",4.6,"nature",0),
                    new PlaceResult("172","Atal Foot Over Bridge","https://upload.wikimedia.org/wikipedia/commons/a/a4/Atal_Pedestrian_Bridge_at_Night.jpg","Ahmedabad, India",4.8,"tours",0)
            );
        }
        else if (location.contains("pune")) {
            return List.of(
                    new PlaceResult("173","Shaniwar Wada","https://commons.wikimedia.org/wiki/Special:FilePath/Front_view_of_Shaniwar_Wada_illuminated.jpg","Pune, India",4.8,"tours",0),
                    new PlaceResult("174","Aga Khan Palace","https://commons.wikimedia.org/wiki/Special:FilePath/Aga_Khan_Palace_Pune_2.jpg","Pune, India",4.7,"museums",40),
                    new PlaceResult("175","Dagdusheth Ganpati","https://commons.wikimedia.org/wiki/Special:FilePath/Dagdusheth_Ganpati,_Pune.jpeg","Pune, India",4.8,"tours",0),
                    new PlaceResult("176","Sinhagad Fort","https://commons.wikimedia.org/wiki/Special:FilePath/Sinhagad_plateau.jpg","Near Pune, India",4.7,"nature",0),
                    new PlaceResult("177","Raja Dinkar Kelkar Museum","https://commons.wikimedia.org/wiki/Special:FilePath/Building_of_Raja_Dinkar_Kelkar_Museum,_Pune.jpg","Pune, India",4.6,"museums",45),
                    new PlaceResult("178","Saras Baug","https://commons.wikimedia.org/wiki/Special:FilePath/Saras_Baug.jpg","Pune, India",4.6,"nature",0)
            );
        }


        else if (location.contains("mysore") || location.contains("mysuru")) {
            return List.of(
                    new PlaceResult("179","Mysore Palace","https://commons.wikimedia.org/wiki/Special:FilePath/Mysore_Palace_-_Night_lighting.jpg","Mysuru, India",4.8,"tours",0),
                    new PlaceResult("180","Brindavan Gardens","https://commons.wikimedia.org/wiki/Special:FilePath/Brindavan_Garden_Fountains_in_Night.jpg","Near Mysuru, India",4.7,"nature",0),
                    new PlaceResult("181","Chamundi Hill Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Chamundi_Temple,_Mysore.jpg","Mysuru, India",4.7,"tours",0),
                    new PlaceResult("182","St. Philomena's Church","https://commons.wikimedia.org/wiki/Special:FilePath/India_-_St._Philomena%27s_Church_02.jpg","Mysuru, India",4.6,"museums",50),
                    new PlaceResult("183","Karanji Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Karanji_lake_pic.jpg","Mysuru, India",4.5,"nature",0),
                    new PlaceResult("184","Mysuru Rail Museum","https://commons.wikimedia.org/wiki/Special:FilePath/Rail_Museum_Mysore.jpg","Mysuru, India",4.4,"museums",55)
            );
        }
        else if (location.contains("amritsar")) {
            return List.of(
                    new PlaceResult("185","Golden Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Hamandir_Sahib_(Golden_Temple).jpg","Amritsar, India",4.9,"tours",0),
                    new PlaceResult("186","Jallianwala Bagh","https://commons.wikimedia.org/wiki/Special:FilePath/Jallianwala_Bagh,_Amritsar_01.jpg","Amritsar, India",4.8,"museums",50),
                    new PlaceResult("187","Durgiana Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Durgiana_Temple,_Amritsar.jpg","Amritsar, India",4.7,"tours",0),
                    new PlaceResult("188","Wagah Border Ceremony","https://commons.wikimedia.org/wiki/Special:FilePath/Attari_-_Wagah_border.jpg","Near Amritsar, India",4.7,"tours",0),
                    new PlaceResult("189","Partition Museum","https://commons.wikimedia.org/wiki/Special:FilePath/Partition_Museum,_Amritsar,_India.jpg","Amritsar, India",4.6,"museums",50),
                    new PlaceResult("190","Gobindgarh Fort","https://commons.wikimedia.org/wiki/Special:FilePath/Entrance_of_Gobindgarh_fort,_Amritsar,Punjab.jpg","Amritsar, India",4.6,"entertainment",60)
            );
        }


        else if (location.contains("indore")) {
            return List.of(
                    new PlaceResult("209","Rajwada Palace","https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Rajwada.jpg","Indore, India",4.8,"tours",0),
                    new PlaceResult("210","Lalbagh Palace","https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh_Palace%2C_Indore.jpg","Indore, India",4.7,"museums",0),
                    new PlaceResult("211","Khajrana Ganesh Temple","https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/e2/a4/98/temple.jpg?w=1200&h=-1&s=1","Indore, India",4.7,"tours",0),
                    new PlaceResult("212","Sarafa Bazaar Night Market","https://wanderon-images.gumlet.io/gallery/new/2025/10/08/1759862032329-best-time-to-visit-sarafa-bazaar.webp","Indore, India",4.6,"entertainment",50),
                    new PlaceResult("213","Patalpani Waterfall","https://commons.wikimedia.org/wiki/Special:FilePath/Patalpani_Waterfalls.jpg","Near Indore, India",4.7,"nature",0),
                    new PlaceResult("214","Ralamandal Wildlife Sanctuary","https://commons.wikimedia.org/wiki/Special:FilePath/Patal_Pani_Waterfall.jpg","Near Indore, India",4.5,"nature",0)
            );
        }
        else if (location.contains("bhopal")) {
            return List.of(
                    new PlaceResult("215","Upper Lake (Bhojtal)","https://chalbanjare.com/crm/sys_images/Upper_Lake1759815545.jpg","Bhopal, India",4.8,"nature",0),
                    new PlaceResult("216","Taj-ul-Masajid","https://commons.wikimedia.org/wiki/Special:FilePath/Taj_Ul_Masajid%2C_Bhopal.JPG","Bhopal, India",4.8,"tours",0),
                    new PlaceResult("217","Lower Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Lower_Lake_Bhopal.jpg","Bhopal, India",4.6,"nature",0),
                    new PlaceResult("218","Van Vihar National Park","https://commons.wikimedia.org/wiki/Special:FilePath/Bhopal_lake.jpg","Bhopal, India",4.6,"nature",0),
                    new PlaceResult("219","Sanchi Stupa","https://www.mptourism.com/images/point-of-interest/The%20Great%20Stupa.webp","Near Bhopal, India",4.8,"museums",40),
                    new PlaceResult("220","Bharat Bhavan","https://commons.wikimedia.org/wiki/Special:FilePath/City_of_Lakes_Bhopal.jpg","Bhopal, India",4.5,"entertainment",65)
            );
        }
        else if (location.contains("guwahati")) {
            return List.of(
                    new PlaceResult("221","Kamakhya Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Kamakhya_Temple%2C_Guwahati.jpg","Guwahati, India",4.9,"tours",0),
                    new PlaceResult("222","Brahmaputra Riverfront","https://commons.wikimedia.org/wiki/Special:FilePath/Guwahati_City_Off_Brahmaputra_Coast_%28189246519%29.jpeg","Guwahati, India",4.7,"nature",0),
                    new PlaceResult("223","Umananda Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Guwahati_Skyline.jpg","Guwahati, India",4.7,"tours",0),
                    new PlaceResult("224","Assam State Museum","https://i0.wp.com/traveldreams.live/wp-content/uploads/2022/02/guhawati-museum-32.jpg?resize=1024%2C683&ssl=1","Guwahati, India",4.6,"museums",40),
                    new PlaceResult("225","Kalakshetra Cultural Center","https://commons.wikimedia.org/wiki/Special:FilePath/Guwahati_citysky.jpg","Guwahati, India",4.6,"entertainment",50),
                    new PlaceResult("226","Dighalipukhuri Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Dighalipukhuri%2C_Guwahati.jpg","Guwahati, India",4.5,"nature",0)
            );
        }
        else if (location.contains("patna")) {
            return List.of(
                    new PlaceResult("227","Golghar","https://commons.wikimedia.org/wiki/Special:FilePath/Patna_Golghar_2.jpg","Patna, India",4.7,"tours",0),
                    new PlaceResult("228","Takht Sri Patna Sahib","https://commons.wikimedia.org/wiki/Special:FilePath/Takht_Sri_Patna_Sahib.jpg","Patna, India",4.9,"tours",0),
                    new PlaceResult("229","Gandhi Maidan","https://commons.wikimedia.org/wiki/Special:FilePath/Patna_-_Golghar.jpg","Patna, India",4.5,"tours",0),
                    new PlaceResult("230","Bihar Museum","https://commons.wikimedia.org/wiki/Special:FilePath/Bihar_Museum_Bailey_Road_02.jpg","Patna, India",4.6,"museums",0),
                    new PlaceResult("231","Patna Museum","https://commons.wikimedia.org/wiki/Special:FilePath/Patna_Museum_-_General_View_(9221515542).jpg","Patna, India",4.5,"museums",40),
                    new PlaceResult("232","Eco Park","https://commons.wikimedia.org/wiki/Special:FilePath/Eco_Park_Patna.jpg","Patna, India",4.7,"nature",0)
                    );
        }

        else if (location.contains("prayagraj") || location.contains("allahabad")) {
            return List.of(
                    new PlaceResult("233","Triveni Sangam","https://commons.wikimedia.org/wiki/Special:FilePath/Triveni_Sangam_Prayagraj.jpg","Prayagraj, India",4.9,"tours",0),
                    new PlaceResult("234","Allahabad Fort","https://commons.wikimedia.org/wiki/Special:FilePath/Allahabad_Fort.JPG","Prayagraj, India",4.7,"tours",0),
                    new PlaceResult("235","Anand Bhavan (Nehru House)","https://commons.wikimedia.org/wiki/Special:FilePath/Anand_Bhawan,_Allahabad.jpg","Prayagraj, India",4.7,"museums",60),
                    new PlaceResult("236","Chandrasekhar Azad Park (Company Garden)","https://commons.wikimedia.org/wiki/Special:FilePath/Queen_Victoria_Memorial_Alfred_Park.JPG","Prayagraj, India",4.6,"nature",0),
                    new PlaceResult("237","Allahabad High Court","https://commons.wikimedia.org/wiki/Special:FilePath/High_Court_of_Allahabad.jpg","Prayagraj, India",4.6,"tours",0),
                    new PlaceResult("238","Sangam River View","https://commons.wikimedia.org/wiki/Special:FilePath/Allahabad_(Prayag_Sangam).jpg","Prayagraj, India",4.7,"nature",0)
            );
        }
        else if (location.contains("kanpur")) {
            return List.of(
                    new PlaceResult("239","JK Temple","https://commons.wikimedia.org/wiki/Special:FilePath/J.K._Temple.jpg","Kanpur, India",4.8,"tours",0),
                    new PlaceResult("240","Moti Jheel","https://commons.wikimedia.org/wiki/Special:FilePath/Moti_Jheel_metro_station.jpg","Kanpur, India",4.6,"tours",0),
                    new PlaceResult("241","Kanpur Memorial Church","https://commons.wikimedia.org/wiki/Special:FilePath/Kanpur_Memorial_Church.jpg","Kanpur, India",4.7,"museums",40),
                    new PlaceResult("242","Kanpur Zoological Park","https://commons.wikimedia.org/wiki/Special:FilePath/VYP_Leopard.jpg","Kanpur, India",4.6,"nature",0),
                    new PlaceResult("243","Massacre Ghat","https://commons.wikimedia.org/wiki/Special:FilePath/Massacre_Ghat,_Kanpur.jpg","Kanpur, India",4.6,"tours",0),
                    new PlaceResult("244","The Mall Road","https://commons.wikimedia.org/wiki/Special:FilePath/The_Mall_Kanpur.jpg","Kanpur, India",4.5,"entertainment",40)
            );
        }
        else if (location.contains("noida")) {
            return List.of(
                    new PlaceResult("245","DLF Mall of India","https://commons.wikimedia.org/wiki/Special:FilePath/DLF_Mall_of_India.jpg","Noida, India",4.7,"entertainment",50),
                    new PlaceResult("246","Worlds of Wonder","https://commons.wikimedia.org/wiki/Special:FilePath/Worlds_Of_Wonder_amusement_park.jpg","Noida, India",4.7,"entertainment",40),
                    new PlaceResult("247","Noida Sector 78 Skyline","https://commons.wikimedia.org/wiki/Special:FilePath/Noida_sector_78.jpg","Noida, India",4.6,"tours",0),
                    new PlaceResult("248","Noida City Skyline","https://commons.wikimedia.org/wiki/Special:FilePath/Noidancrdelhiskyline.jpg","Noida, India",4.6,"tours",0),
                    new PlaceResult("249","Okhla Bird Sanctuary","https://commons.wikimedia.org/wiki/Special:FilePath/Okhla_Bird_Sanctuary_Noida_Delhi.jpg","Noida, India",4.7,"nature",0),
                    new PlaceResult("250","Greater Noida Sky View","https://commons.wikimedia.org/wiki/Special:FilePath/G._Noida_sky_view.jpg","Greater Noida, near Noida, India",4.6,"tours",0)
            );
        }

        else if (location.contains("ayodhya")) {
            return List.of(
                    new PlaceResult("251","Shri Ram Janmbhoomi Mandir","https://srjbtkshetra.org/wp-content/uploads/2020/11/Cam_04_01_Comp.jpg","Ayodhya, India",4.9,"tours",0),
                    new PlaceResult("252","Hanuman Garhi Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman_Garhi_Temple-32.jpg","Ayodhya, India",4.8,"tours",0),
                    new PlaceResult("253","Kanak Bhawan Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Kanak_Bhawan,_Ayodhya_India.jpg","Ayodhya, India",4.7,"tours",0),
                    new PlaceResult("254","Naya Ghat, Saryu River","https://commons.wikimedia.org/wiki/Special:FilePath/Naya_ghat,_Saryu_river,_ayodhya.jpg","Ayodhya, India",4.7,"nature",0),
                    new PlaceResult("255","Saryu River Bank","https://d2py10ayqu2jji.cloudfront.net/Ram-Ki-Paidi-Ayodhya.webp","Ayodhya, India",4.6,"nature",0),
                    new PlaceResult("256","Ram Mandir Inauguration View","https://commons.wikimedia.org/wiki/Special:FilePath/Ayodhya_Ram_Mandir_Inauguration_Day_Picture.jpg","Ayodhya, India",4.9,"tours",0)
            );
        }
        else if (location.contains("jhansi")) {
            return List.of(
                    new PlaceResult("257","Jhansi Fort","https://commons.wikimedia.org/wiki/Special:FilePath/Jhansi_fort.JPG","Jhansi, India",4.8,"tours",0),
                    new PlaceResult("258","Rani Mahal, Jhansi","https://commons.wikimedia.org/wiki/Special:FilePath/Rani_Mahal,_a_royal_palace_in_the_city_of_Jhansi,_Uttar_Pradesh_23.jpg","Jhansi, India",4.7,"museums",50),
                    new PlaceResult("259","St. Jude's Shrine","https://commons.wikimedia.org/wiki/Special:FilePath/St_Jude_shrine_Jhansi.jpg","Jhansi, India",4.6,"tours",0),
                    new PlaceResult("260","Jhansi Railway Station","https://commons.wikimedia.org/wiki/Special:FilePath/Jhansi_Railway_Station.JPG","Jhansi, India",4.6,"tours",0),
                    new PlaceResult("261","Barua Sagar Lake View","https://commons.wikimedia.org/wiki/Special:FilePath/Barua_Sagar_viewed_from_the_fort.jpg","Barua Sagar, near Jhansi, India",4.7,"nature",0),
                    new PlaceResult("262","Jhansi City View from Fort","https://commons.wikimedia.org/wiki/Special:FilePath/Jhansi_view.jpg","Jhansi, India",4.5,"tours",0)
            );
        }
        else if (location.contains("meerut")) {
            return List.of(
                    new PlaceResult("263","Meerut Ghantaghar (Clock Tower)","https://commons.wikimedia.org/wiki/Special:FilePath/Meerut_Ghantaghar.jpg","Meerut, India",4.8,"tours",0),
                    new PlaceResult("264","St. John's Church, Meerut","https://commons.wikimedia.org/wiki/Special:FilePath/StJohnsChurchMeerut.jpg","Meerut, India",4.7,"museums",55),
                    new PlaceResult("265","Ashtapad Jain Temple, Hastinapur","https://commons.wikimedia.org/wiki/Special:FilePath/Ashtapad_Hastinapur.jpg","Hastinapur, near Meerut, India",4.7,"tours",0),
                    new PlaceResult("266","Ashtapad Temple (Hastinapur View)","https://commons.wikimedia.org/wiki/Special:FilePath/Ashtapad.jpg","Hastinapur, near Meerut, India",4.6,"tours",0),
                    new PlaceResult("267","Meerut City (Outside Junction)","https://commons.wikimedia.org/wiki/Special:FilePath/MEERUT_CITY.jpg","Meerut, India",4.5,"tours",0),
                    new PlaceResult("268","Mall Road, Meerut Cantt","https://commons.wikimedia.org/wiki/Special:FilePath/Mall_Road_Meerut_Cantt.jpg","Meerut, India",4.6,"entertainment",50)
            );
        }

        else if (location.contains("mussoorie") || location.contains("landour")) {
            return List.of(
                    new PlaceResult("269","Mall Road, Mussoorie","https://commons.wikimedia.org/wiki/Special:FilePath/Mall_Road,_Mussoorie_03.JPG","Mussoorie, India",4.7,"tours",0),
                    new PlaceResult("270","Kempty Falls","https://commons.wikimedia.org/wiki/Special:FilePath/Kempty_Falls_near_Mussoorie.jpg","Near Mussoorie, India",4.8,"nature",0),
                    new PlaceResult("271","Mussoorie Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Mussoorie_Lake.jpg","Mussoorie, India",4.6,"nature",0),
                    new PlaceResult("272","Gun Hill Viewpoint","https://commons.wikimedia.org/wiki/Special:FilePath/Gun_Hill_in_Mussoorie_-_panoramio.jpg","Mussoorie, India",4.7,"tours",0),
                    new PlaceResult("273","Company Garden, Mussoorie","https://commons.wikimedia.org/wiki/Special:FilePath/Company_garden,_Mussoorie.jpg","Mussoorie, India",4.6,"nature",0),
                    new PlaceResult("274","Lal Tibba (Hill View)","https://commons.wikimedia.org/wiki/Special:FilePath/View_from_laal_tibba_1.jpg","Mussoorie, India",4.8,"nature",0),

                    // Landour additions
                    new PlaceResult("191","Landour Clock Tower","https://miro.medium.com/v2/resize:fit:1400/1*QPijhbiWOEvXwj_vQgVXQQ.jpeg","Landour, India",4.6,"tours",0),
                    new PlaceResult("192","St. Paul’s Church, Landour","https://t.eucdn.in/tourism/lg-jpg/kellogg-memorial-church-mussoorie-5621854.jpg","Landour, India",4.7,"museums",40),
                    new PlaceResult("193","Ivy Cottage / Ruskin Bond Area","https://homes-and-villas.marriott.com/hvmb-pictures/40175309/01_Facade__19_.jpeg","Landour, India",4.8,"tours",0)
            );
        }

        else if (location.contains("kashmir") || location.contains("srinagar")) {
            return List.of(
                    new PlaceResult("275","Dal Lake, Srinagar","https://commons.wikimedia.org/wiki/Special:FilePath/Dal_Lake,_Srinagar,_Kashmir.jpg","Srinagar, Jammu & Kashmir, India",4.9,"nature",0),
                    new PlaceResult("276","Shankaracharya Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Shankaracharya_Temple,_Srinagar.jpg","Srinagar, Jammu & Kashmir, India",4.8,"tours",0),
                    new PlaceResult("277","Shalimar Bagh, Srinagar","https://commons.wikimedia.org/wiki/Special:FilePath/Shalimar_Bagh,_Srinagar.jpg","Srinagar, Jammu & Kashmir, India",4.7,"nature",0),
                    new PlaceResult("278","Nishat Bagh, Srinagar","https://commons.wikimedia.org/wiki/Special:FilePath/Nishat_Bagh_Srinagar_01.jpg","Srinagar, Jammu & Kashmir, India",4.7,"nature",0),
                    new PlaceResult("279","Gulmarg Snow Valley","https://commons.wikimedia.org/wiki/Special:FilePath/Gulmarg_-_Kashmir_5.jpg","Gulmarg, Jammu & Kashmir, India",4.8,"nature",0),
                    new PlaceResult("280","Pahalgam Valley (Lidder Valley)","https://commons.wikimedia.org/wiki/Special:FilePath/Pahalgam_Valley.jpg","Pahalgam, Jammu & Kashmir, India",4.8,"nature",0)
            );
        }
        else if (location.contains("manali")) {
            return List.of(
                    new PlaceResult("281","Manali Town View","https://commons.wikimedia.org/wiki/Special:FilePath/Manali_,Himachal_Pradesh,_India.jpg","Manali, Himachal Pradesh, India",4.8,"tours",0),
                    new PlaceResult("282","Hidimba Devi Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_03.JPG","Manali, Himachal Pradesh, India",4.7,"tours",0),
                    new PlaceResult("283","Solang Valley","https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley,_India.jpg","Solang Valley, near Manali, India",4.8,"nature",0),
                    new PlaceResult("284","Beas River, Old Manali","https://commons.wikimedia.org/wiki/Special:FilePath/Beas_River_-_Manali,_Himachal_Pradesh,_India_-_rohanakakaka.jpg","Old Manali, Himachal Pradesh, India",4.6,"nature",0),
                    new PlaceResult("285","Jogini Waterfalls","https://commons.wikimedia.org/wiki/Special:FilePath/Jogini_falls.jpg","Manali, Himachal Pradesh, India",4.7,"nature",0),
                    new PlaceResult("286","Rohtang Pass","https://commons.wikimedia.org/wiki/Special:FilePath/Rohtang_Pass_at_himachal_pradesh.jpg","Near Manali, Himachal Pradesh, India",4.8,"tours",0)
            );
        }
        else if (location.contains("ladakh") || location.contains("leh")) {
            return List.of(
                    new PlaceResult("287","Leh City View from Shanti Stupa","https://commons.wikimedia.org/wiki/Special:FilePath/Leh_City_seen_from_Shanti_Stupa.JPG","Leh, Ladakh, India",4.8,"tours",0),
                    new PlaceResult("288","Shanti Stupa, Leh","https://commons.wikimedia.org/wiki/Special:FilePath/Shanti_Stupa_at_Night_2.jpg","Leh, Ladakh, India",4.8,"tours",0),
                    new PlaceResult("289","Pangong Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Pangong_Lake_(233023585).jpeg","Pangong Tso, Ladakh, India",4.9,"nature",0),
                    new PlaceResult("290","Nubra Valley Sand Dunes","https://commons.wikimedia.org/wiki/Special:FilePath/Sand_dunes_of_Nubra_Valley,_Ladakh.jpg","Nubra Valley, Ladakh, India",4.8,"nature",0),
                    new PlaceResult("291","Khardung La Pass","https://commons.wikimedia.org/wiki/Special:FilePath/Khardung_La_(pass),_Ladakh,_North_India.jpg","Khardung La, Ladakh, India",4.7,"tours",0),
                    new PlaceResult("292","Hemis Monastery","https://commons.wikimedia.org/wiki/Special:FilePath/Hemis_Monastery_02.jpg","Hemis, Ladakh, India",4.7,"museums",40)
            );
        }
        else if (location.contains("tawang")) {
            return List.of(
                    new PlaceResult("293","Tawang Monastery","https://commons.wikimedia.org/wiki/Special:FilePath/Tawang_Monastery,_Arunachal_Pradesh.jpg","Tawang, India",4.8,"tours",0),
                    new PlaceResult("294","Madhuri Lake (Sangetsar Tso)","https://commons.wikimedia.org/wiki/Special:FilePath/Madhuri_Lake.jpg","Near Tawang, India",4.8,"nature",0),
                    new PlaceResult("295","PTSO Lake (Pankang Teng Tso)","https://commons.wikimedia.org/wiki/Special:FilePath/PTSO_Lake.jpg","Near Tawang, India",4.7,"nature",0),
                    new PlaceResult("296","Nuranang Waterfall (Jung Falls)","https://commons.wikimedia.org/wiki/Special:FilePath/Nuranang_Waterfall.jpg","Near Tawang, India",4.8,"nature",0),
                    new PlaceResult("297","Tawang Gateway","https://commons.wikimedia.org/wiki/Special:FilePath/Tawang_Gateway.jpg","Tawang, India",4.6,"tours",0),
                    new PlaceResult("298","Tawang Town & Valley View","https://commons.wikimedia.org/wiki/Special:FilePath/Tawang-town.jpg","Tawang, India",4.5,"tours",0)
            );
        }
        else if (location.contains("nainital")) {
            return List.of(
                    new PlaceResult("299","Nainital Lake Top View","https://commons.wikimedia.org/wiki/Special:FilePath/Nainital_Lake_Top_View.jpg","Nainital, India",4.8,"nature",0),
                    new PlaceResult("300","Mall Road, Nainital","https://commons.wikimedia.org/wiki/Special:FilePath/Upper_Mall_Road,_Nainital.jpg","Nainital, India",4.6,"tours",0),
                    new PlaceResult("301","Maa Naina Devi Temple","https://commons.wikimedia.org/wiki/Special:FilePath/Maa_Naina_Devi_Temple,_Mallital,_Nainital,_Uttarakhand,_India.jpg","Nainital, India",4.7,"tours",0),
                    new PlaceResult("302","Snow View Point, Nainital","https://commons.wikimedia.org/wiki/Special:FilePath/Nainital_Snow_View_Point_2024.jpg","Nainital, India",4.7,"nature",0),
                    new PlaceResult("303","Tiffin Top (Dorothy's Seat)","https://commons.wikimedia.org/wiki/Special:FilePath/Tiffin-top_Nainital.jpg","Nainital, India",4.6,"nature",0),
                    new PlaceResult("304","Nainital Lake in the Evening","https://commons.wikimedia.org/wiki/Special:FilePath/Nainital_Lake_in_the_evening.jpg","Nainital, India",4.8,"nature",0)
            );
        }
        else if (location.contains("munnar")) {
            return List.of(
                    new PlaceResult("306","Munnar Tea Plantations","https://commons.wikimedia.org/wiki/Special:FilePath/Tea_plantations_in_Munnar,_Kerala.jpg","Munnar, India",4.9,"nature",0),
                    new PlaceResult("307","Mattupetty Dam & Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Mattupetty_Dam_reservoir,_near_Munnar,_Kerala.jpg","Near Munnar, India",4.8,"nature",0),
                    new PlaceResult("308","Munnar View Point","https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_view_point.jpg","Munnar, India",4.8,"nature",0),
                    new PlaceResult("309","Munnar Town (Hill Station View)","https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_.jpg","Munnar, India",4.6,"tours",0),
                    new PlaceResult("310","Munnar Hills & River View","https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_-_View_from_Grand_Plaza_Hotel.jpg","Munnar, India",4.7,"nature",0),
                    new PlaceResult("311","Munnar Town Street View","https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_town.jpg","Munnar, India",4.6,"tours",0)
            );
        }

        else if (location.contains("ooty")) {
            return List.of(
                    new PlaceResult("312","Ooty Lake","https://commons.wikimedia.org/wiki/Special:FilePath/Ooty_Lake.jpg","Ooty, India",4.8,"nature",0),
                    new PlaceResult("313","Government Botanical Garden, Ooty","https://commons.wikimedia.org/wiki/Special:FilePath/Ooty_botanical_garden.jpg","Ooty, India",4.7,"nature",0),
                    new PlaceResult("314","Doddabetta Peak Viewpoint","https://commons.wikimedia.org/wiki/Special:FilePath/Pic_from_Doddabetta_Peak.jpg","Near Ooty, India",4.8,"nature",0),
                    new PlaceResult("315","Rose Garden, Ooty","https://commons.wikimedia.org/wiki/Special:FilePath/Rose_Garden_in_Ooty,_Tamil_Nadu.JPG","Ooty, India",4.7,"nature",0),
                    new PlaceResult("316","Nilgiri Mountain Railway (Ooty Station)","https://commons.wikimedia.org/wiki/Special:FilePath/Nilgiri_Mountain_Railways,_Ooty_Station,_India.jpg","Ooty, India",4.8,"tours",0),
                    new PlaceResult("317","Ooty Lake Boating","https://commons.wikimedia.org/wiki/Special:FilePath/Ooty_Lake_Boating2.jpg","Ooty, India",4.7,"tours",0)
            );
        }
        else if (location.contains("darjeeling")) {
            return List.of(
                    new PlaceResult("400", "Darjeeling Himalayan Railway (Toy Train)", "https://commons.wikimedia.org/wiki/Special:FilePath/Darjeeling_Himalayan_Railway.jpg", "Darjeeling, India", 4.8, "tours",0),
                    new PlaceResult("401", "Tiger Hill Viewpoint", "https://commons.wikimedia.org/wiki/Special:FilePath/View_from_Tiger_Hill_Darjeeling_with_praying_flags_1.jpg", "Darjeeling, India", 4.9, "nature",0),
                    new PlaceResult("402", "Batasia Loop", "https://commons.wikimedia.org/wiki/Special:FilePath/Batasia_Loop_of_Darjeeling_Himalayan_Railway.jpg", "Near Darjeeling, India", 4.8, "tours",0),
                    new PlaceResult("403", "Japanese Peace Pagoda", "https://commons.wikimedia.org/wiki/Special:FilePath/Japanese_Peace_Pagoda,_Darjeeling.jpg", "Darjeeling, India", 4.7, "historical",0),
                    new PlaceResult("404", "Darjeeling Tea Garden", "https://commons.wikimedia.org/wiki/Special:FilePath/Tea_Garden_Darjeeling.jpg", "Darjeeling, India", 4.8, "nature",0),
                    new PlaceResult("405", "Ghoom Monastery (Yiga Choeling)", "https://commons.wikimedia.org/wiki/Special:FilePath/Samten_Choling_Buddhist_Ghoom_Monastery.jpg", "Near Darjeeling, India", 4.7, "historical",0)
            );
        }
        else if (location.contains("haridwar")) {
            return List.of(
                    new PlaceResult("406", "Har Ki Pauri", "https://commons.wikimedia.org/wiki/Special:FilePath/Har_Ki_Pauri_Haridwar.jpg", "Haridwar, India", 4.8, "nature",0),
                    new PlaceResult("407", "Mansa Devi Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Mansa_Devi_Temple,_Haridwar.JPG", "Haridwar, India", 4.7, "historical",0),
                    new PlaceResult("408", "Chandi Devi Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Chandi_Devi_Mandir,Haridwar.JPG", "Near Haridwar, India", 4.8, "historical",0),
                    new PlaceResult("409", "Ganga Aarti at Har Ki Pauri", "https://commons.wikimedia.org/wiki/Special:FilePath/Ganga_Aarti_Haridwar.jpg", "Haridwar, India", 4.9, "tours",0),
                    new PlaceResult("410", "Daksha Mahadev Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Daksheshwar_Mahadev_temple,_Kankhal.JPG", "Near Haridwar, India", 4.7, "historical",0),
                    new PlaceResult("411", "Maya Devi Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Maya_Devi_Temple,_Haridwar.JPG", "Haridwar, India", 4.7, "historical",0)
            );
        }

        else if (location.contains("rishikesh")) {
            return List.of(
                    new PlaceResult("318", "Laxman Jhula (Lakshman Jhula)", "https://commons.wikimedia.org/wiki/Special:FilePath/Laxman_Jhula,_Rishikesh,_Uttaranchal.jpg", "Rishikesh, India", 4.8, "tours",0),
                    new PlaceResult("319", "Ram Jhula Bridge", "https://commons.wikimedia.org/wiki/Special:FilePath/Ram_Jhula_of_Rishikesh_01.JPG", "Rishikesh, India", 4.8, "tours",0),
                    new PlaceResult("320", "Beatles Ashram (Maharishi Mahesh Yogi Ashram)", "https://commons.wikimedia.org/wiki/Special:FilePath/Beatles_Ashram_At_Rishikesh.jpg", "Rishikesh, India", 4.7, "historical",0),
                    new PlaceResult("321", "Ganga Aarti at Parmarth Niketan", "https://commons.wikimedia.org/wiki/Special:FilePath/Ganga_Aarti,_Rishikesh.jpg", "Rishikesh, India", 4.9, "tours",0),
                    new PlaceResult("322", "Neelkanth Mahadev Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/NeelKanth_Mahadev_Temple.JPG", "Near Rishikesh, India", 4.7, "historical",0),
                    new PlaceResult("323", "River Rafting on Ganga", "https://commons.wikimedia.org/wiki/Special:FilePath/Rafting_in_rishikesh.jpg", "Rishikesh, India", 4.8, "adventure",600)
            );
        }
        else if (location.contains("auli")) {
            return List.of(
                    new PlaceResult("324", "Auli Ropeway (Gondola)", "https://commons.wikimedia.org/wiki/Special:FilePath/Auli_in_summer.jpg", "Auli, India", 4.8, "tours",0),
                    new PlaceResult("325", "Auli Artificial Lake", "https://commons.wikimedia.org/wiki/Special:FilePath/Auli_Lake_in_Feburary_2015.jpg", "Auli, India", 4.7, "nature",0),
                    new PlaceResult("326", "Gorson Bugyal", "https://commons.wikimedia.org/wiki/Special:FilePath/A_view_from_auli.jpg", "Near Auli, India", 4.8, "nature",0),
                    new PlaceResult("327", "Nanda Devi Viewpoint", "https://commons.wikimedia.org/wiki/Special:FilePath/Mountain_Nanda_Devi_seen_from_Auli.jpg", "Auli, India", 4.9, "nature",0),
                    new PlaceResult("328", "Auli Ski Resort", "https://commons.wikimedia.org/wiki/Special:FilePath/Auli_Ski_Resort_in_summer_2012.jpg", "Auli, India", 4.8, "adventure",120),
                    new PlaceResult("329", "Auli Slopes & Chair Lift Area", "https://commons.wikimedia.org/wiki/Special:FilePath/Auli-slopes.jpg", "Auli, India", 4.7, "adventure",80)
            );
        }
        else if (location.contains("dharamshala")) {
            return List.of(
                    new PlaceResult("330", "HPCA Cricket Stadium", "https://commons.wikimedia.org/wiki/Special:FilePath/HPCA_Stadium_Dharamsala.jpg", "Dharamshala, India", 4.8, "tours",0),
                    new PlaceResult("331", "Dalai Lama Temple (Tsuglagkhang)", "https://commons.wikimedia.org/wiki/Special:FilePath/McLeod_Ganj_from_the_Dalai_Lama_Temple_(6466149411).jpg", "McLeod Ganj, Dharamshala, India", 4.9, "historical",0),
                    new PlaceResult("332", "Dal Lake McLeod Ganj", "https://commons.wikimedia.org/wiki/Special:FilePath/Dal_Lake_McLeodgunj.jpg", "Dharamshala, India", 4.7, "nature",0),
                    new PlaceResult("334", "Triund Hill Viewpoint", "https://commons.wikimedia.org/wiki/Special:FilePath/Triund,_Dharamsala.jpg", "Near Dharamshala, India", 4.8, "nature",0),
                    new PlaceResult("335", "Bhagsunag Waterfall", "https://commons.wikimedia.org/wiki/Special:FilePath/Bhagsu_falls_,_Dharmashala.jpg", "Near Dharamshala, India", 4.8, "nature",0),
                    new PlaceResult("336", "Norbulingka Institute", "https://commons.wikimedia.org/wiki/Special:FilePath/Norbulingka_Institute_Dharamshala.jpg", "Dharamshala, India", 4.7, "historical",0)
            );
        }

        else if (location.contains("kasauli")) {
            return List.of(
                    new PlaceResult("337", "Christ Church, Kasauli", "https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church,_Kasauli.JPG", "Kasauli, India", 4.8, "historical",0),
                    new PlaceResult("338", "Sunset Point, Kasauli", "https://commons.wikimedia.org/wiki/Special:FilePath/Sunset_point_2.jpg", "Kasauli, India", 4.8, "nature",0),
                    new PlaceResult("339", "Central Research Institute (Pasteur Institute), Kasauli", "https://commons.wikimedia.org/wiki/Special:FilePath/Central_Research_Institute,_Kasauli.JPG", "Kasauli, India", 4.7, "historical",40),
                    new PlaceResult("340", "Gilbert Trail (Gulbert Trail)", "https://commons.wikimedia.org/wiki/Special:FilePath/Gulbert_trail_Kasauli.jpg", "Near Kasauli, India", 4.7, "adventure",70),
                    new PlaceResult("341", "Kasauli Hills Panorama", "https://commons.wikimedia.org/wiki/Special:FilePath/Kasauli,_Himachal_Pradesh.jpg", "Kasauli, India", 4.8, "nature",0),
                    new PlaceResult("342", "Early Morning View of Kasauli", "https://commons.wikimedia.org/wiki/Special:FilePath/A_view_of_early_morning_of_Kasauli,India.jpg", "Kasauli, India", 4.7, "nature",0)
            );
        }

        else if (location.contains("udaipur") || location.contains("jodhpur") || location.contains("jaisalmer") || location.contains("pushkar")) {
            return List.of(
                    new PlaceResult("343", "Udaipur City Palace", "https://commons.wikimedia.org/wiki/Special:FilePath/City_Palace_of_Udaipur.jpg", "Udaipur, India", 4.8, "historical",0),
                    new PlaceResult("344", "Udaipur City Palace at Night", "https://commons.wikimedia.org/wiki/Special:FilePath/Udaipur_City_Palace_at_Night.jpg", "Udaipur, India", 4.9, "historical",0),
                    new PlaceResult("345", "Jagdish Temple Udaipur", "https://commons.wikimedia.org/wiki/Special:FilePath/Jagdish_Temple_-Udaipur_-Rajasthan_-DSC_0003.jpg", "Udaipur, India", 4.7, "historical",0),
                    new PlaceResult("346", "Mehrangarh Fort Jodhpur", "https://commons.wikimedia.org/wiki/Special:FilePath/Jodhpur_Mehrangarh_fort.jpg", "Jodhpur, India", 4.8, "historical",0),
                    new PlaceResult("347", "Umaid Bhawan Palace Jodhpur", "https://commons.wikimedia.org/wiki/Special:FilePath/Umaid_bhawan_palace_Jodhpur.jpg", "Jodhpur, India", 4.8, "historical",0),
                    new PlaceResult("348", "Jodhpur Clock Tower", "https://commons.wikimedia.org/wiki/Special:FilePath/Jodhpur_Clock_Tower.jpg", "Jodhpur, India", 4.7, "historical",30),
                    new PlaceResult("349", "Jaisalmer Fort (Golden Fort)", "https://commons.wikimedia.org/wiki/Special:FilePath/The_mesmerizing_golden_fort_of_Jaisalmer.jpg", "Jaisalmer, India", 4.9, "historical",40),
                    new PlaceResult("350", "Patwon Ki Haveli Jaisalmer", "https://commons.wikimedia.org/wiki/Special:FilePath/Patwon_Ki_Haveli_Jaisalmer.JPG", "Jaisalmer, India", 4.7, "historical",0),
                    new PlaceResult("351", "Golden Jaisalmer Fort View", "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Jaisalmer_Fort.jpg", "Jaisalmer, India", 4.8, "historical",0),
                    new PlaceResult("352", "Brahma Temple Pushkar", "https://commons.wikimedia.org/wiki/Special:FilePath/Brambha_Temple-Pushkar.jpg", "Pushkar, India", 4.8, "historical",0),
                    new PlaceResult("353", "Pushkar Lake Ghats", "https://commons.wikimedia.org/wiki/Special:FilePath/Pushkar,_India,_Pushkar_Lake,_Ghats.jpg", "Pushkar, India", 4.7, "nature",0),
                    new PlaceResult("354", "Savitri Temple Pushkar (Hilltop View)", "https://commons.wikimedia.org/wiki/Special:FilePath/Hill_top_temple,_overlooking_Pushkar_lake,_Rajasthan.jpg", "Near Pushkar, India", 4.7, "nature",0)
            );
        }

        else if (location.contains("mathura")) {
            return List.of(
                    new PlaceResult("355", "Shri Krishna Janmabhoomi Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Mathura_Temple-Mathura-India0002.JPG", "Mathura, India", 4.8, "historical",0),
                    new PlaceResult("356", "Vishram Ghat", "https://commons.wikimedia.org/wiki/Special:FilePath/Vishram_Ghat.jpg", "Mathura, India", 4.8, "nature",0),
                    new PlaceResult("357", "Shri Dwarkadhish Temple & Yamuna River View", "https://commons.wikimedia.org/wiki/Special:FilePath/Yamuna_River,_Mathura.jpg", "Mathura, India", 4.8, "historical",0),
                    new PlaceResult("358", "Government Museum, Mathura (Exterior)", "https://commons.wikimedia.org/wiki/Special:FilePath/Government_Museum_-_Mathura_2013-02-23_5112.JPG", "Mathura, India", 4.7, "historical",0),
                    new PlaceResult("359", "Banke Bihari Temple (Vrindavan, near Mathura)", "https://commons.wikimedia.org/wiki/Special:FilePath/Banke_Bihari_Temple,_Vrindavan,_Mathura,_Uttar_Pradesh,_India_(2010).jpg", "Near Mathura, India", 4.9, "historical",0),
                    new PlaceResult("360", "Yamuna Ghat Beauty at Mathura", "https://commons.wikimedia.org/wiki/Special:FilePath/The_beauty_of_Yamuna_river.jpg", "Mathura, India", 4.8, "nature",0)
            );
        }

        else if (location.contains("vrindavan")) {
            return List.of(
                    new PlaceResult("361", "Banke Bihari Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Banke_Bihari_Vrindavan.jpg", "Vrindavan, India", 4.9, "historical",0),
                    new PlaceResult("362", "Prem Mandir (Temple of Divine Love)", "https://commons.wikimedia.org/wiki/Special:FilePath/Prem_Mandir_Vrindavan_2022_03.jpg", "Vrindavan, India", 4.8, "historical",0),
                    new PlaceResult("363", "ISKCON Temple (Sri Krishna Balaram Temple)", "https://commons.wikimedia.org/wiki/Special:FilePath/Iskcon_Vrindavan.jpg", "Vrindavan, India", 4.8, "historical",0),
                    new PlaceResult("364", "Rangji Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Rangji_temple_(Vrindavan).jpg", "Vrindavan, India", 4.7, "historical",0),
                    new PlaceResult("365", "Govind Dev Temple", "https://commons.wikimedia.org/wiki/Special:FilePath/Govind_Dev_temple_at_vrindavan_from_entrance.jpg", "Vrindavan, India", 4.7, "historical",0),
                    new PlaceResult("366", "Yamuna River Ghat", "https://commons.wikimedia.org/wiki/Special:FilePath/Ghat_at_Yamuna_river,_Vrindavan.jpg", "Vrindavan, India", 4.8, "nature",0)
            );
        }
        else if (location.contains("chandigarh")) {
            return List.of(
                    new PlaceResult("367", "Nek Chand's Rock Garden", "https://commons.wikimedia.org/wiki/Special:FilePath/Chandigarh_Rock_Garden_1.jpg", "Chandigarh, India", 4.8, "nature",0),
                    new PlaceResult("368", "Sukhna Lake", "https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh_India.jpg", "Chandigarh, India", 4.8, "nature",0),
                    new PlaceResult("369", "Punjab and Haryana High Court (Capitol Complex)", "https://commons.wikimedia.org/wiki/Special:FilePath/Capitol_High_Court.jpg", "Chandigarh, India", 4.9, "historical",0),
                    new PlaceResult("370", "Open Hand Monument", "https://commons.wikimedia.org/wiki/Special:FilePath/Open_hand_monument_of_Chandigarh,_India.jpg", "Chandigarh, India", 4.8, "historical",0),
                    new PlaceResult("371", "Zakir Hussain Rose Garden", "https://commons.wikimedia.org/wiki/Special:FilePath/Chandigarh,_India_rose_garden_5.jpg", "Chandigarh, India", 4.7, "nature",0),
                    new PlaceResult("372", "Palace of Assembly (Capitol Complex)", "https://commons.wikimedia.org/wiki/Special:FilePath/Palace_of_Assembly_Chandigarh_2006.jpg", "Chandigarh, India", 4.8, "historical",0)
            );
        }
        else if (location.contains("gangtok")) {
            return List.of(
                    new PlaceResult("373","Tsomgo Lake (Changu Lake)","https://commons.wikimedia.org/wiki/Special:FilePath/Tsomgo_Lake_Sikkim.jpg","Gangtok, Sikkim, India",4.9,"nature",0),
                    new PlaceResult("374","Nathula Pass","https://imgcdn.flamingotravels.co.in/Images/PlacesOfInterest/Nathula-Pass-Gangtok-3.jpg","Gangtok, Sikkim, India",4.9,"nature",0),
                    new PlaceResult("375","Rumtek Monastery","https://hblimg.mmtcdn.com/content/hubble/img/gangtok/mmt/activities/m_activities-gangtok-rumtek-monastery_l_400_640.jpg","Gangtok, Sikkim, India",4.8,"historical",0),
                    new PlaceResult("376","MG Marg","https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/6d/8f/92/img-20201203-165738-largejpg.jpg?w=1200&h=-1&s=1","Gangtok, Sikkim, India",4.8,"shopping",0),
                    new PlaceResult("377","Ganesh Tok View Point","https://www.trawell.in/admin/images/upload/901968657Gangtok_Ganesh_Tok_View_Point_Main.jpg","Gangtok, Sikkim, India",4.7,"nature",0),
                    new PlaceResult("378","Tashi View Point","https://s7ap1.scene7.com/is/image/incredibleindia/tashi-view-point-gangtok-sikkim-1-attr-hero?qlt=82&ts=1742160327797","Gangtok, Sikkim, India",4.7,"nature",0),
                    new PlaceResult("379","Namgyal Institute of Tibetology","https://namgyalinstitutesikkim.org/wp-content/uploads/2023/07/about1.jpg","Gangtok, Sikkim, India",4.7,"museum",40),
                    new PlaceResult("380","Enchey Monastery","https://d3gw4aml0lneeh.cloudfront.net/assets/locations/xDCL9DI0QElM.jpg","Gangtok, Sikkim, India",4.7,"historical",0)
            );
        }







        // Default for any other location - Enhanced with 6 diverse attractions
        else {
            return List.of(
                    new PlaceResult("55", "City Center Tour", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", searchLocation, 4.5, "tours",0),
                    new PlaceResult("56", "Local Museum", "https://cdn.pixabay.com/photo/2020/12/09/21/11/stairs-5818603_640.jpg", searchLocation, 4.3, "museums",40),
                    new PlaceResult("57", "Scenic Viewpoint", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", searchLocation, 4.7, "nature",0),
                    new PlaceResult("58", "Cultural Show", "https://cdn.pixabay.com/photo/2017/10/25/20/34/khon-2889163_640.jpg", searchLocation, 4.4, "entertainment",50),
                    new PlaceResult("59", "Historic Landmark", "https://cdn.pixabay.com/photo/2021/07/24/15/47/venice-6489813_640.jpg", searchLocation, 4.6, "tours",0),
                    new PlaceResult("60", "Botanical Garden", "https://cdn.pixabay.com/photo/2022/08/06/15/16/grapevine-7368800_640.jpg", searchLocation, 4.2, "nature",0),
                    new PlaceResult("61", "Food Market Tour", "https://cdn.pixabay.com/photo/2020/08/09/11/24/fish-5475257_640.jpg", searchLocation, 4.8, "entertainment",60),
                    new PlaceResult("62", "River Cruise", "https://cdn.pixabay.com/photo/2022/03/21/14/18/boats-7083304_640.jpg", searchLocation, 4.5, "tours",0),
                    new PlaceResult("63", "Art Gallery", "https://cdn.pixabay.com/photo/2014/01/14/22/33/art-gallery-245251_640.jpg", searchLocation, 4.4, "museums",40),
                    new PlaceResult("64", "Mountain Hiking", "https://cdn.pixabay.com/photo/2022/02/13/15/59/river-7011476_640.jpg", searchLocation, 4.9, "nature",0),
                    new PlaceResult("65", "Traditional Workshop", "https://cdn.pixabay.com/photo/2019/09/26/14/23/vice-4506104_640.jpg", searchLocation, 4.6, "entertainment",55),
                    new PlaceResult("66", "Sunset Photography Tour", "https://cdn.pixabay.com/photo/2020/10/07/10/51/mountains-5634817_640.jpg", searchLocation, 4.7, "tours",0),
                    new PlaceResult("67", "Local Craft Brewery", "https://cdn.pixabay.com/photo/2017/06/24/23/41/beer-2439237_1280.jpg", searchLocation, 4.3, "entertainment",45),
                    new PlaceResult("68", "Ancient Ruins Exploration", "https://cdn.pixabay.com/photo/2018/10/14/13/01/ruin-3746423_640.jpg", searchLocation, 4.8, "museums",40),
                    new PlaceResult("69", "Wildlife Safari", "https://cdn.pixabay.com/photo/2017/10/20/10/58/elephant-2870777_1280.jpg", searchLocation, 4.9, "nature",0),
                    new PlaceResult("70", "Cooking Class Experience", "https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_640.jpg", searchLocation, 4.6, "entertainment",70),
                    new PlaceResult("71", "Night City Tour", "https://cdn.pixabay.com/photo/2021/07/30/08/21/street-6509043_640.jpg", searchLocation, 4.5, "tours",0),
                    new PlaceResult("73", "Historic Castle Visit", "https://cdn.pixabay.com/photo/2015/11/26/12/45/garden-1063833_640.jpg", searchLocation, 4.7, "museums",50),
                    new PlaceResult("74", "Beach Day Experience", "https://cdn.pixabay.com/photo/2023/03/29/17/50/beach-7886067_640.jpg", searchLocation, 4.6, "nature",0),
                    new PlaceResult("75", "Street Art Walking Tour", "https://cdn.pixabay.com/photo/2023/09/01/19/09/couple-8227550_640.jpg", searchLocation, 4.4, "tours",0)
            );
        }
    }
}
package com.janisar.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

// This tells Spring to ignore any fields we don't define here
@JsonIgnoreProperties(ignoreUnknown = true)
public class GooglePlacesResponse {

    @JsonProperty("results")
    private List<Place> results;

    // Getters and Setters
    public List<Place> getResults() { return results; }
    public void setResults(List<Place> results) { this.results = results; }

    // Inner class to represent each Place in the results
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Place {
        @JsonProperty("place_id")
        private String placeId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("formatted_address")
        private String address;

        @JsonProperty("rating")
        private double rating;

        @JsonProperty("photos")
        private List<Photo> photos;

        // Getters and Setters
        public String getPlaceId() { return placeId; }
        public void setPlaceId(String placeId) { this.placeId = placeId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        public List<Photo> getPhotos() { return photos; }
        public void setPhotos(List<Photo> photos) { this.photos = photos; }
    }

    // Inner class for photos
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Photo {
        @JsonProperty("photo_reference")
        private String photoReference;

        // Getters and Setters
        public String getPhotoReference() { return photoReference; }
        public void setPhotoReference(String photoReference) { this.photoReference = photoReference; }
    }
}
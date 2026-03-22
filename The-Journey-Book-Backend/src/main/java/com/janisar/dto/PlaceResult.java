package com.janisar.dto;

public class PlaceResult {
    private String placeId;
    private String name;
    private String imageUrl;
    private String address;
    private double rating;
    private String category;
    private int price;

    // Constructor for easy creation in the Controller
    public PlaceResult(String placeId, String name, String imageUrl, String address, double rating) {
        this.placeId = placeId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.address = address;
        this.rating = rating;
        this.category = "tours"; // Default category
    }

    // New constructor with category
    public PlaceResult(String placeId, String name, String imageUrl, String address, double rating, String category, int price) {
        this.placeId = placeId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.address = address;
        this.rating = rating;
        this.category = category;
        this.price = price;
    }

    // Default constructor (necessary for Spring)
    public PlaceResult() {}

    // Getters and Setters
    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
}
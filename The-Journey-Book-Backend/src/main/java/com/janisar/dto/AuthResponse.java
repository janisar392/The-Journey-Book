package com.janisar.dto;

public class AuthResponse {
    private String message;
    private UserResponse user;
    private String token; // Add this field

    public AuthResponse() {}

    public AuthResponse(String message, UserResponse user, String token) {
        this.message = message;
        this.user = user;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
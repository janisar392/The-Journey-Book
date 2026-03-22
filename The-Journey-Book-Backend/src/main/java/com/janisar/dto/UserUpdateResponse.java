package com.janisar.dto;

public class UserUpdateResponse {
    private String message;
    private UserResponse user;

    public UserUpdateResponse() {}

    public UserUpdateResponse(String message, UserResponse user) {
        this.message = message;
        this.user = user;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
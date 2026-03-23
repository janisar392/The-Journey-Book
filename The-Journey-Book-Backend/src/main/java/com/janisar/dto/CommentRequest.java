package com.janisar.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentRequest {

    @NotBlank(message = "Comment text is required")
    private String text;

    // Getters and Setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
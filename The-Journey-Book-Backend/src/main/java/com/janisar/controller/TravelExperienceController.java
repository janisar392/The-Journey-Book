package com.janisar.controller;

import com.janisar.dto.CommentRequest;
import com.janisar.dto.CreateExperienceRequest;
import com.janisar.dto.ExperienceResponse;
import com.janisar.dto.UpdateExperienceRequest;
import com.janisar.service.JwtService;
import com.janisar.service.TravelExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = {"http://localhost:3000", "https://the-journey-book.netlify.app"})
public class TravelExperienceController {

    @Autowired
    private TravelExperienceService experienceService;

    @Autowired
    private JwtService jwtService;

    // Create new experience
    @PostMapping
    public ResponseEntity<?> createExperience(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateExperienceRequest request) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            ExperienceResponse response = experienceService.createExperience(userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all experiences
    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getAllExperiences() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }

    // Get experience by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getExperienceById(@PathVariable String id) {
        try {
            ExperienceResponse response = experienceService.getExperienceById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Update experience
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperience(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id,
            @Valid @RequestBody UpdateExperienceRequest request) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            ExperienceResponse response = experienceService.updateExperience(id, userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Delete experience
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            experienceService.deleteExperience(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Story deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Like experience
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeExperience(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            ExperienceResponse response = experienceService.toggleLike(id, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Add comment
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            ExperienceResponse response = experienceService.addComment(id, userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get experiences by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExperienceResponse>> getExperiencesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(experienceService.getExperiencesByUser(userId));
    }

    // Get experiences by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<ExperienceResponse>> getExperiencesByLocation(@PathVariable String location) {
        return ResponseEntity.ok(experienceService.getExperiencesByLocation(location));
    }
}
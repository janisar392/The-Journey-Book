package com.janisar.service;

import com.janisar.dto.CommentRequest;
import com.janisar.dto.CreateExperienceRequest;
import com.janisar.dto.ExperienceResponse;
import com.janisar.dto.UpdateExperienceRequest;
import com.janisar.entity.TravelExperience;
import com.janisar.entity.TravelExperience.Comment;
import com.janisar.entity.User;
import com.janisar.repository.TravelExperienceRepository;
import com.janisar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TravelExperienceService {

    @Autowired
    private TravelExperienceRepository experienceRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new travel experience
    public ExperienceResponse createExperience(String userId, CreateExperienceRequest request) {
        // Get user details
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Create new experience
        TravelExperience experience = new TravelExperience();
        experience.setUserId(userId);
        experience.setAuthorName(user.getName());
        experience.setAuthorEmail(user.getEmail());
        experience.setTitle(request.getTitle());
        experience.setContent(request.getContent());
        experience.setImageUrl(request.getImageUrl());
        experience.setTags(request.getTags());
        experience.setLocation(request.getLocation());

        TravelExperience saved = experienceRepository.save(experience);
        return mapToResponse(saved);
    }

    // Get all experiences
    public List<ExperienceResponse> getAllExperiences() {
        return experienceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get experience by ID
    public ExperienceResponse getExperienceById(String id) {
        Optional<TravelExperience> experience = experienceRepository.findById(id);
        if (experience.isEmpty()) {
            throw new RuntimeException("Experience not found");
        }
        return mapToResponse(experience.get());
    }

    // Update experience
    public ExperienceResponse updateExperience(String id, String userId, UpdateExperienceRequest request) {
        Optional<TravelExperience> experienceOptional = experienceRepository.findById(id);
        if (experienceOptional.isEmpty()) {
            throw new RuntimeException("Experience not found");
        }

        TravelExperience experience = experienceOptional.get();

        // Check if user is the author
        if (!experience.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own stories");
        }

        // Update fields
        experience.setTitle(request.getTitle());
        experience.setContent(request.getContent());
        experience.setImageUrl(request.getImageUrl());
        experience.setTags(request.getTags());
        experience.setLocation(request.getLocation());
        experience.setUpdatedAt(LocalDateTime.now());

        TravelExperience updated = experienceRepository.save(experience);
        return mapToResponse(updated);
    }

    // Delete experience
    public void deleteExperience(String id, String userId) {
        Optional<TravelExperience> experienceOptional = experienceRepository.findById(id);
        if (experienceOptional.isEmpty()) {
            throw new RuntimeException("Experience not found");
        }

        TravelExperience experience = experienceOptional.get();

        // Check if user is the author
        if (!experience.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own stories");
        }

        experienceRepository.deleteById(id);
    }

    // Like/Unlike experience
    public ExperienceResponse toggleLike(String id, String userId) {
        Optional<TravelExperience> experienceOptional = experienceRepository.findById(id);
        if (experienceOptional.isEmpty()) {
            throw new RuntimeException("Experience not found");
        }

        TravelExperience experience = experienceOptional.get();

        // For now, simple like count
        // In production, you'd track which users liked
        experience.setLikes(experience.getLikes() + 1);

        TravelExperience updated = experienceRepository.save(experience);
        return mapToResponse(updated);
    }

    // Add comment
    public ExperienceResponse addComment(String id, String userId, CommentRequest request) {
        Optional<TravelExperience> experienceOptional = experienceRepository.findById(id);
        if (experienceOptional.isEmpty()) {
            throw new RuntimeException("Experience not found");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        TravelExperience experience = experienceOptional.get();
        User user = userOptional.get();

        Comment comment = new Comment(userId, user.getName(), request.getText());
        experience.getComments().add(comment);

        TravelExperience updated = experienceRepository.save(experience);
        return mapToResponse(updated);
    }

    // Get experiences by user
    public List<ExperienceResponse> getExperiencesByUser(String userId) {
        return experienceRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get experiences by location
    public List<ExperienceResponse> getExperiencesByLocation(String location) {
        return experienceRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Map entity to response DTO
    private ExperienceResponse mapToResponse(TravelExperience experience) {
        ExperienceResponse response = new ExperienceResponse();
        response.setId(experience.getId());
        response.setUserId(experience.getUserId());
        response.setAuthorName(experience.getAuthorName());
        response.setAuthorEmail(experience.getAuthorEmail());
        response.setTitle(experience.getTitle());
        response.setContent(experience.getContent());
        response.setImageUrl(experience.getImageUrl());
        response.setTags(experience.getTags());
        response.setLocation(experience.getLocation());
        response.setLikes(experience.getLikes());
        response.setComments(experience.getComments());
        response.setCreatedAt(experience.getCreatedAt());
        response.setUpdatedAt(experience.getUpdatedAt());
        return response;
    }
}
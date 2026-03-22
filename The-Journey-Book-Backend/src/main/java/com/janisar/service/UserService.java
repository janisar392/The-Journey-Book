package com.janisar.service;

import com.janisar.dto.ChangePasswordRequest;
import com.janisar.dto.UpdateUserRequest;
import com.janisar.dto.UserResponse;
import com.janisar.dto.UserUpdateResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public UserUpdateResponse updateUser(String userId, UpdateUserRequest request) {
        // Find user
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Check if email is already taken by another user
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use by another account");
        }

        // Update user details
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        User updatedUser = userRepository.save(user);

        // Create response
        UserResponse userResponse = new UserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail()
        );

        return new UserUpdateResponse("Profile updated successfully", userResponse);
    }

    public UserUpdateResponse changePassword(String userId, ChangePasswordRequest request) {
        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // Find user
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Check if user has a password (for social login users)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("This account uses social login. Please use Google/Facebook to change password.");
        }

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new UserUpdateResponse("Password changed successfully", null);
    }

    public UserResponse getUserProfile(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
package com.janisar.controller;

import com.janisar.dto.AuthResponse;
import com.janisar.dto.UserResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://the-journey-book.netlify.app"})
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/user")
    public ResponseEntity<?> oauth2Success(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("User not authenticated", null, null)
                );
            }

            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google didn't provide email address", null, null)
                );
            }

            // Check if user exists, if not create new user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        newUser.setPassword(""); // Empty password for OAuth users
                        return userRepository.save(newUser);
                    });

            // Generate JWT token
            String token = jwtService.generateToken(user);

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );

            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }
}
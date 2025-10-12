package com.janisar.controller;

import com.janisar.dto.AuthResponse;
import com.janisar.dto.UserResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://the-journey-book.netlify.app"}) // ADD CORS
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            System.out.println("=== OAuth2 SUCCESS ENDPOINT CALLED ==="); // DEBUG

            // FIX: Check if principal is null (this was causing the NullPointerException)
            if (principal == null) {
                System.out.println("Principal is NULL - no user data received"); // DEBUG
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google authentication failed - no user data received", null, null)
                );
            }

            Map<String, Object> attributes = principal.getAttributes();
            System.out.println("OAuth2 User Attributes: " + attributes); // DEBUG

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");

            // Check if email is available (required field)
            if (email == null || email.isEmpty()) {
                System.out.println("Email is NULL or empty"); // DEBUG
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google didn't provide email address", null, null)
                );
            }

            System.out.println("Processing OAuth2 user: " + email); // DEBUG

            // Check if user exists, if not create new user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]); // Default name if null
                        newUser.setPassword("OAUTH_USER"); // Add password field for OAuth users
                        System.out.println("Creating new user: " + email); // DEBUG
                        return userRepository.save(newUser);
                    });

            // Generate JWT token
            String token = jwtService.generateToken(user);

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );

            System.out.println("OAuth2 Login successful for: " + email); // DEBUG
            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            // Log the error for debugging
            System.out.println("OAuth2 Error: " + e.getMessage()); // DEBUG
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }

    // ADD DEBUG ENDPOINT
    @GetMapping("/oauth2/debug")
    public ResponseEntity<?> oauth2Debug(@AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            return ResponseEntity.ok().body("OAuth2 User: " + principal.getAttributes());
        } else {
            return ResponseEntity.ok().body("No OAuth2 User found");
        }
    }
}
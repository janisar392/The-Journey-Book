package com.janisar.controller;

import com.janisar.dto.AuthResponse;
import com.janisar.dto.UserResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // SIMPLE endpoint that creates user from Google data
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            System.out.println("Google login request: " + request.getEmail());

            String email = request.getEmail();
            String name = request.getName();

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Email is required", null, null)
                );
            }

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : "Google User");
                        newUser.setPassword("OAUTH_USER");
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
                    new AuthResponse("Error: " + e.getMessage(), null, null)
            );
        }
    }
}

class GoogleLoginRequest {
    private String email;
    private String name;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
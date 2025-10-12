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
@CrossOrigin(origins = {"http://localhost:3000", "https://the-journey-book.netlify.app"})
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/oauth2/user")
    public ResponseEntity<?> getOAuth2User(@AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("No authenticated user found", null, null)
                );
            }

            Map<String, Object> attributes = principal.getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google didn't provide email address", null, null)
                );
            }

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        newUser.setPassword("OAUTH_USER"); // Placeholder for OAuth users
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
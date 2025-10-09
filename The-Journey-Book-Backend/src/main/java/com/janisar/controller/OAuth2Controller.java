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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2Controller.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("Test endpoint is working");
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            logger.info("OAuth2 success endpoint called");

            if (principal == null) {
                logger.error("Principal is null - OAuth2 authentication failed");
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google authentication failed - no user data received", null, null)
                );
            }

            Map<String, Object> attributes = principal.getAttributes();
            logger.info("OAuth2 attributes: {}", attributes.keySet());

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");

            logger.info("Extracted email: {}, name: {}", email, name);

            if (email == null || email.isEmpty()) {
                logger.error("Email is null or empty");
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google didn't provide email address", null, null)
                );
            }

            // Check if user exists, if not create new user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        logger.info("Creating new user for email: {}", email);
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                    //    newUser.setProfilePicture(picture);
                        return userRepository.save(newUser);
                    });

            logger.info("User found/created: {}", user.getEmail());

            // Generate JWT token
            String token = jwtService.generateToken(user);
            logger.info("JWT token generated successfully");

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
                   // user.getProfilePicture()
            );

            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            logger.error("Error during OAuth2 login:", e);
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }
}
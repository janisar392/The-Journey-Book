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

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google authentication failed - no user data received", null, null)
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

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        return userRepository.save(newUser);
                    });

            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());

            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }

    // NEW: Direct OAuth2 endpoint that works in production
    @GetMapping("/oauth2/user")
    public ResponseEntity<?> getOAuth2User(@AuthenticationPrincipal OAuth2User principal) {
        System.out.println("🔄 /oauth2/user called - Principal: " + (principal != null ? "Present" : "Null"));

        if (principal == null) {
            return ResponseEntity.badRequest().body(
                    new AuthResponse("No OAuth2 user found. Please complete Google login first.", null, null)
            );
        }

        try {
            Map<String, Object> attributes = principal.getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            System.out.println("📧 User email from OAuth2: " + email);

            if (email == null) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google didn't provide email address", null, null)
                );
            }

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        return userRepository.save(newUser);
                    });

            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());

            System.out.println("✅ OAuth2 login successful for: " + email);
            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            System.out.println("❌ OAuth2 error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }
}
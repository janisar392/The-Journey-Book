package com.janisar.controller;

import com.janisar.dto.AuthResponse;
import com.janisar.dto.UserResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // METHOD 1: Direct OAuth2 user data
    @GetMapping("/oauth2/user")
    public ResponseEntity<?> getOAuth2User(HttpServletRequest request) {
        System.out.println("=== OAUTH2 USER ENDPOINT CALLED ===");

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔵 Authentication: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));
            System.out.println("🔵 Authenticated: " + (authentication != null && authentication.isAuthenticated()));

            if (authentication != null && authentication.isAuthenticated() &&
                    authentication instanceof OAuth2AuthenticationToken) {

                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                OAuth2User principal = oauthToken.getPrincipal();

                System.out.println("✅ OAuth2 User FOUND!");
                return processOAuth2User(principal);
            } else {
                System.out.println("❌ No OAuth2 authentication found");
                System.out.println("🔵 Principal: " + (authentication != null ? authentication.getPrincipal() : "NULL"));
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Please complete Google login first", null, null)
                );
            }
        } catch (Exception e) {
            System.out.println("💥 Error in /oauth2/user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Server error: " + e.getMessage(), null, null)
            );
        }
    }

    // METHOD 2: Original success endpoint
    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success() {
        System.out.println("=== OAUTH2 SUCCESS ENDPOINT CALLED ===");

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔵 Authentication type: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));

            if (authentication != null && authentication.isAuthenticated() &&
                    authentication instanceof OAuth2AuthenticationToken) {

                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                OAuth2User principal = oauthToken.getPrincipal();

                System.out.println("✅ OAuth2 Success - User authenticated!");
                return processOAuth2User(principal);
            } else {
                System.out.println("❌ OAuth2 authentication missing in success endpoint");
                return ResponseEntity.badRequest().body(
                        new AuthResponse("OAuth2 authentication not found. Please login with Google.", null, null)
                );
            }
        } catch (Exception e) {
            System.out.println("💥 Error in oauth2Success: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }

    // Common method to process OAuth2 user
    private ResponseEntity<?> processOAuth2User(OAuth2User principal) {
        try {
            Map<String, Object> attributes = principal.getAttributes();
            System.out.println("📧 OAuth2 Attributes: " + attributes.keySet());

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            System.out.println("👤 User Email: " + email);
            System.out.println("👤 User Name: " + name);

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
                        System.out.println("🆕 Creating new user: " + email);
                        return userRepository.save(newUser);
                    });

            // Generate JWT token
            String token = jwtService.generateToken(user);
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());

            System.out.println("🎉 OAuth2 LOGIN SUCCESSFUL for: " + email);
            return ResponseEntity.ok(new AuthResponse("Google login successful", userResponse, token));

        } catch (Exception e) {
            System.out.println("💥 Error processing OAuth2 user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error processing user data: " + e.getMessage(), null, null)
            );
        }
    }
}
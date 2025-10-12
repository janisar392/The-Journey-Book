package com.janisar.controller;

import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.UserInfo;
import com.janisar.dto.AuthResponse;
import com.janisar.dto.UserResponse;
import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.Auth0Service;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class Auth0Controller {

    @Autowired
    private Auth0Service auth0Service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/auth0/login")
    public ResponseEntity<?> auth0Login() {
        try {
            String redirectUrl = auth0Service.getAuthorizationUrl(); // No arguments needed
            return ResponseEntity.ok(Map.of("redirectUrl", redirectUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new AuthResponse("Auth0 login failed: " + e.getMessage(), null, null)
            );
        }
    }

    @PostMapping("/auth0/callback")
    public ResponseEntity<?> auth0Callback(@RequestBody Map<String, String> request) {
        try {
            System.out.println("=== AUTH0 CALLBACK ENDPOINT CALLED ===");
            String code = request.get("code");

            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Authorization code is required", null, null)
                );
            }

            System.out.println("Received authorization code: " + code.substring(0, 10) + "...");

            // Exchange code for tokens
            var tokenHolder = auth0Service.exchangeCodeForTokens(code);
            String accessToken = tokenHolder.getAccessToken();
            System.out.println("Access token received: " + accessToken.substring(0, 20) + "...");

            // Get user info from Auth0
            UserInfo userInfo = auth0Service.getUserInfo(accessToken);
            Map<String, Object> userInfoMap = userInfo.getValues();

            // Debug: Print all user info
            System.out.println("=== AUTH0 USER INFO ===");
            userInfoMap.forEach((key, value) -> {
                System.out.println(key + ": " + value);
            });

            String email = (String) userInfoMap.get("email");
            String name = (String) userInfoMap.get("name");
            String sub = (String) userInfoMap.get("sub"); // Auth0 user ID

            // If email is null, try to generate one from sub (Auth0 user ID)
            if (email == null || email.isEmpty()) {
                System.out.println("Email not provided by Auth0, generating from sub: " + sub);
                if (sub != null && sub.contains("|")) {
                    // sub format: "google|123456789" or "facebook|123456789"
                    String[] parts = sub.split("\\|");
                    if (parts.length == 2) {
                        email = parts[1] + "@" + parts[0] + ".auth0user.com";
                    }
                } else {
                    email = sub + "@auth0user.com";
                }
                System.out.println("Generated email: " + email);
            }

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Unable to get or generate email address", null, null)
                );
            }

            // If name is null, use email username
            if (name == null || name.isEmpty()) {
                name = email.split("@")[0];
            }

            System.out.println("Final user info - Email: " + email + ", Name: " + name);

            // Make final copies for use in lambda
            final String finalEmail = email;
            final String finalName = name;

            // Check if user exists, if not create new user
            User user = userRepository.findByEmail(finalEmail)
                    .orElseGet(() -> {
                        System.out.println("Creating new user for email: " + finalEmail);
                        User newUser = new User();
                        newUser.setEmail(finalEmail);
                        newUser.setName(finalName);
                        newUser.setPassword(""); // Empty password for social users
                        return userRepository.save(newUser);
                    });

            // Generate your own JWT token
            String token = jwtService.generateToken(user);

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );

            return ResponseEntity.ok(new AuthResponse("Auth0 login successful", userResponse, token));

        } catch (Auth0Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    new AuthResponse("Auth0 authentication failed: " + e.getMessage(), null, null)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Auth0 login: " + e.getMessage(), null, null)
            );
        }
    }
}
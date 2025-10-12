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
            String code = request.get("code");

            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Authorization code is required", null, null)
                );
            }

            // Exchange code for tokens
            var tokenHolder = auth0Service.exchangeCodeForTokens(code); // No redirectUri needed
            String accessToken = tokenHolder.getAccessToken();

            // Get user info from Auth0
            UserInfo userInfo = auth0Service.getUserInfo(accessToken);
            Map<String, Object> userInfoMap = userInfo.getValues();

            String email = (String) userInfoMap.get("email");
            String name = (String) userInfoMap.get("name");
            String picture = (String) userInfoMap.get("picture");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Auth0 didn't provide email address", null, null)
                );
            }

            // Check if user exists, if not create new user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        newUser.setPassword(""); // Set empty password for Auth0 users
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
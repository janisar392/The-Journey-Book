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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            // FIX: Check if principal is null (this was causing the NullPointerException)
            if (principal == null) {
                return ResponseEntity.badRequest().body(
                        new AuthResponse("Google authentication failed - no user data received", null, null)
                );
            }

            Map<String, Object> attributes = principal.getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");

            // Check if email is available (required field)
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
                        newUser.setName(name != null ? name : email.split("@")[0]); // Default name if null
                        // You can set picture if needed
                        // newUser.setProfilePicture(picture);
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
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    new AuthResponse("Error during Google login: " + e.getMessage(), null, null)
            );
        }
    }

    // ADD THIS DEBUG ENDPOINT
    @GetMapping("/oauth2/callback")
    public ResponseEntity<?> oauth2Callback(HttpServletRequest request) {
        try {
            System.out.println("🔵 OAuth2 Callback Received");
            System.out.println("🔵 Query String: " + request.getQueryString());
            System.out.println("🔵 Full URL: " + request.getRequestURL());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔵 Authentication: " + (auth != null ? auth.getName() : "NULL"));
            System.out.println("🔵 Authenticated: " + (auth != null && auth.isAuthenticated()));

            if (auth != null && auth.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) auth.getPrincipal();
                System.out.println("🔵 OAuth2User attributes: " + oauth2User.getAttributes().keySet());
            }

            return ResponseEntity.ok(Map.of(
                    "status", "callback_received",
                    "authenticated", auth != null && auth.isAuthenticated(),
                    "auth_name", auth != null ? auth.getName() : "null",
                    "auth_class", auth != null ? auth.getClass().getSimpleName() : "null"
            ));
        } catch (Exception e) {
            System.out.println("❌ Callback error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
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
        if (principal == null) {
            return ResponseEntity.badRequest().body("No user data received");
        }

        Map<String, Object> attributes = principal.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        if (email == null) {
            return ResponseEntity.badRequest().body("Email not provided");
        }

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name != null ? name : "User");
                    return userRepository.save(newUser);
                });

        // Generate token
        String token = jwtService.generateToken(user);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        return ResponseEntity.ok(new AuthResponse("Success", userResponse, token));
    }
}
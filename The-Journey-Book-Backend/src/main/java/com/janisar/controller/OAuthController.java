package com.janisar.controller;

import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class OAuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;

    @GetMapping("/login/oauth2/code/google")
    public void handleGoogleCallback(@AuthenticationPrincipal OAuth2User principal,
                                     HttpServletResponse response) throws IOException {
        if (principal == null) {
            response.sendRedirect("https://the-journey-book.netlify.app/login?error=auth_failed");
            return;
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "User");
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user);
        String redirectUrl = "https://the-journey-book.netlify.app/oauth2-success?token=" + token + "&email=" + email + "&name=" + name;
        response.sendRedirect(redirectUrl);
    }
}
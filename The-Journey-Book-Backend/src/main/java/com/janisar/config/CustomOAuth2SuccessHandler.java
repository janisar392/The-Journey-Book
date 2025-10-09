package com.janisar.config;

import com.janisar.entity.User;
import com.janisar.repository.UserRepository;
import com.janisar.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        System.out.println("🎉 OAuth2 SUCCESS HANDLER CALLED!");

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauth2User = oauthToken.getPrincipal();

            Map<String, Object> attributes = oauth2User.getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            System.out.println("✅ OAuth2 User Authenticated: " + email);

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name != null ? name : email.split("@")[0]);
                        return userRepository.save(newUser);
                    });

            // Generate JWT token
            String token = jwtService.generateToken(user);

            // Redirect to frontend with token and user data
            String targetUrl = UriComponentsBuilder.fromUriString("https://the-journey-book.netlify.app/oauth2-success")
                    .queryParam("token", token)
                    .queryParam("user", user.toString()) // You might want to serialize user properly
                    .build().toUriString();

            System.out.println("🔗 Redirecting to: " + targetUrl);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}
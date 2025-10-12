package com.janisar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(this.googleClientRegistration());
    }

    // ADD THIS METHOD
    private ClientRegistration googleClientRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId("${GOOGLE_OAUTH_CLIENT_ID}")
                .clientSecret("${GOOGLE_OAUTH_CLIENT_SECRET}")
                .scope("profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .clientName("Google")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        // LOCAL DEVELOPMENT - Uncomment when testing locally
                        // .defaultSuccessUrl("http://localhost:3000/oauth2-success", true)

                        // PRODUCTION - Uncomment for production
                        .defaultSuccessUrl("https://the-journey-book.netlify.app/oauth2-success", true)

                        // Explicit base URI configuration (works for both environments)
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                );

        return http.build();
    }
}
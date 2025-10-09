package com.janisar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Changed this
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/auth/**", "/oauth2/**", "/login/oauth2/**", "/api/auth/oauth2/**").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("https://the-journey-book.netlify.app/oauth2-success", true)
                        .failureUrl("https://the-journey-book.netlify.app/login?error=oauth_failed")
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                );

        return http.build();
    }
}
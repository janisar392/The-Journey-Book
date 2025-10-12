package com.janisar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allow ALL requests for now
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("https://the-journey-book.netlify.app/oauth2-success", true)
                        .failureUrl("https://the-journey-book.netlify.app/login?error=auth_failed")
                );

        return http.build();
    }
}
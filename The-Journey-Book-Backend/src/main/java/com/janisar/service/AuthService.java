package com.janisar.service;

import com.janisar.dto.AuthResponse;
import com.janisar.dto.LoginRequest;
import com.janisar.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
}
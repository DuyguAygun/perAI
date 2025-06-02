package com.perai.controller;

import com.perai.dto.*;
import com.perai.service.AuthService;
import com.perai.service.JwtService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<InformationBody> register(@Valid @RequestBody RegisterBody request) {
        InformationBody response = authService.register(request);
        return ResponseEntity.status(HttpStatus.valueOf(response.getStatus())).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginBody request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.status(HttpStatus.valueOf(response.getStatus())).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<InformationBody> logout(@RequestHeader("Authorization") String token) {
        InformationBody response = authService.logout(token.replace("Bearer ", ""));
        return ResponseEntity.status(HttpStatus.valueOf(response.getStatus())).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        LoginResponse response = jwtService.refreshAccessToken(request);
        return ResponseEntity.status(HttpStatus.valueOf(response.getStatus())).body(response);
    }
}
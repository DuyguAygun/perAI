package com.perai.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.perai.dto.LoginResponse;
import com.perai.dto.RefreshTokenRequest;
import com.perai.exception.JwtBadRequestException;
import com.perai.model.JwtToken;
import com.perai.model.User;
import com.perai.repository.JwtTokenRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String EMAIL_KEY = "email";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiresAt}")
    private Long expiresAt;

    @Value("${jwt.refreshExpiresAt}")
    private Long refreshExpiresAt;

    private Algorithm algorithm;
    private final JwtTokenRepository jwtTokenRepository;

    @PostConstruct
    public void init() {
        if (secret == null || secret.isEmpty()) {
            throw new JwtBadRequestException("JWT secret key must not be null or empty!");
        }
        algorithm = Algorithm.HMAC256(secret.getBytes());
    }

    @Transactional
    public JwtToken generateTokens(User user) {
        String accessToken = createToken(user.getEmail(), expiresAt);
        String refreshToken = createToken(user.getEmail(), refreshExpiresAt);

        JwtToken token = JwtToken.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .expiresAt(new Date(System.currentTimeMillis() + expiresAt))
                .refreshExpiresAt(new Date(System.currentTimeMillis() + refreshExpiresAt))
                .enabled(true)
                .user(user)
                .build();

        return jwtTokenRepository.save(token);
    }

    private String createToken(String email, long expiryTime) {
        return JWT.create()
                .withIssuer("admin")
                .withExpiresAt(new Date(System.currentTimeMillis() + expiryTime))
                .withClaim(EMAIL_KEY, email)
                .sign(algorithm);
    }

    public String getEmail(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token)
                .getClaim(EMAIL_KEY)
                .asString();
    }

    public boolean validateToken(String token) {
        return jwtTokenRepository.findByToken(token)
                .filter(t -> !isExpired(t.getExpiresAt()) && t.isEnabled())
                .isPresent();
    }

    @Transactional
    public LoginResponse refreshAccessToken(RefreshTokenRequest request) {
        Optional<JwtToken> storedToken = jwtTokenRepository.findByRefreshToken(request.getRefreshToken());

        if (storedToken.isEmpty() || isExpired(storedToken.get().getRefreshExpiresAt())) {
            throw new JwtBadRequestException("Refresh Token is expired or not enabled");
        }

        JwtToken oldToken = storedToken.get();
        String newAccessToken = createToken(oldToken.getUser().getEmail(), expiresAt);

        JwtToken newToken = JwtToken.builder()
                .token(newAccessToken)
                .refreshToken(oldToken.getRefreshToken())
                .expiresAt(new Date(System.currentTimeMillis() + expiresAt))
                .refreshExpiresAt(new Date(System.currentTimeMillis() + refreshExpiresAt))
                .enabled(true)
                .user(oldToken.getUser())
                .build();

        jwtTokenRepository.save(newToken);

        return new LoginResponse(
                newToken.getToken(),
                newToken.getRefreshToken(),
                HttpStatus.OK.value(),
                System.currentTimeMillis()
        );
    }

    @Transactional
    public void logout(String token) {
        jwtTokenRepository.findByToken(token).ifPresent(t -> {
            t.setEnabled(false);
            jwtTokenRepository.save(t);
        });
    }

    private boolean isExpired(Date expiresAt) {
        return expiresAt.before(new Date());
    }
}
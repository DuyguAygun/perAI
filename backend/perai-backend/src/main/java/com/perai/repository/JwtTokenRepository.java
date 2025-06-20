package com.perai.repository;

import com.perai.model.JwtToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {
    Optional<JwtToken> findByToken(String token);

    Optional<JwtToken> findByRefreshToken(String refreshToken);
}
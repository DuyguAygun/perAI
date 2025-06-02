package com.perai.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private String refreshToken;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date refreshExpiresAt;

    private boolean enabled;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
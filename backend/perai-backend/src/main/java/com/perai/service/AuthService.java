package com.perai.service;

import com.perai.dto.InformationBody;
import com.perai.dto.LoginBody;
import com.perai.dto.LoginResponse;
import com.perai.dto.RegisterBody;
import com.perai.exception.JwtBadRequestException;
import com.perai.exception.UserBadRequestException;
import com.perai.exception.UserNotFoundException;
import com.perai.model.JwtToken;
import com.perai.model.User;
import com.perai.model.UserRole;
import com.perai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthService {

    private final EncryptionService encryptionService;
    private UserService userService;
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;

    @Transactional
    public InformationBody register(RegisterBody registerBody) {
        boolean emailPresent = userRepository.findByEmail(registerBody.getEmail()).isPresent();

        if (emailPresent) {
            throw new UserBadRequestException("User already exists");
        }

        registerBody.setPassword(encryptionService.encryptPassword(registerBody.getPassword()));
        User user = new User(
                registerBody.getName(),
                registerBody.getLastName(),
                registerBody.getEmail(),
                registerBody.getPassword(),
                UserRole.STUDENT
        );

        userService.save(user);

        return new InformationBody(
                "User successfully registered.",
                HttpStatus.CREATED.value(),
                System.currentTimeMillis()
        );
    }

    public LoginResponse login(LoginBody loginBody) {
        Optional<User> optionalUser = userRepository.findByEmail(loginBody.getEmail());
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        User user = optionalUser.get();
        if (!encryptionService.checkPassword(loginBody.getPassword(), user.getPassword())) {
            throw new UserBadRequestException("Incorrect password");
        }

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginBody.getEmail(),
                                loginBody.getPassword()
                        )
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        JwtToken jwtToken = jwtService.generateTokens(user);

        return new LoginResponse(
                jwtToken.getToken(),
                jwtToken.getRefreshToken(),
                HttpStatus.OK.value(),
                System.currentTimeMillis()
        );
    }

    public InformationBody logout(String token) {
        if (!jwtService.validateToken(token)) {
            throw new JwtBadRequestException("Invalid token");
        }

        jwtService.logout(token);
        SecurityContextHolder.clearContext();

        return new InformationBody(
                "Logout successful.",
                HttpStatus.OK.value(),
                System.currentTimeMillis()
        );
    }
}
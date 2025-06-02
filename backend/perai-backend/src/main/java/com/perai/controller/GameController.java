package com.perai.controller;

import com.perai.dto.GuessGame;
import com.perai.model.User;
import com.perai.service.GameService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/game")
@AllArgsConstructor
public class GameController {

    private GameService gameService;

    @GetMapping("/guess")
    public ResponseEntity<List<GuessGame>> guessGame(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(gameService.getWords(user));
    }

}
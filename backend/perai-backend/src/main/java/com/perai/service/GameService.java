package com.perai.service;

import com.perai.dto.GuessGame;
import com.perai.model.StudentDictionary;
import com.perai.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GameService {

    private final StudentDictionaryService studentDictionaryService;

    public List<GuessGame> getWords(User user) {
        List<StudentDictionary> words = studentDictionaryService.findAllByStudentId(user.getId());
        List<GuessGame> gameWords = new ArrayList<>();
        words.forEach(dict -> {
            GuessGame game = new GuessGame();
            game.setWord(dict.getWord());
            gameWords.add(game);
        });
        Collections.shuffle(gameWords);
        return gameWords.stream().limit(10).collect(Collectors.toList());
    }
}
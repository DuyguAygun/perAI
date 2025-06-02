package com.perai.controller;

import com.perai.dto.AIRequest;
import com.perai.dto.AIResponse;
import com.perai.service.AIService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/ai")
@AllArgsConstructor
public class AIController {

    private AIService aiService;

    @PostMapping("/chat")
    public Mono<AIResponse> chat(@Valid @RequestBody AIRequest request) {
        return aiService.chatWithPythonAPI(request);
    }

}
package com.perai.controller;

import com.perai.dto.ChatMessage;
import com.perai.model.User;
import com.perai.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(
            @Payload ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        return chatService.sendMessage(message, headerAccessor);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage joinChat(@Payload ChatMessage message,
                                SimpMessageHeaderAccessor headerAccessor
    ) {
        return chatService.joinChat(
                headerAccessor.getSessionId(),
                message,
                headerAccessor
        );
    }

    @GetMapping("/users")
    public List<User> getConnectedUsers() {
        return chatService.getAllConnectedUsers();
    }

}
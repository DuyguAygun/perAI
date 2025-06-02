package com.perai.service;

import com.perai.dto.ChatMessage;
import com.perai.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final UserService userService;
    private final Map<String, User> sessionUserMap = new ConcurrentHashMap<>();

    public ChatMessage joinChat(
            String sessionId,
            ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        User user = userService.findByEmail(message.getSenderEmail());

        headerAccessor.getSessionAttributes().put("user", user);
        sessionUserMap.put(sessionId, user);

        return ChatMessage.builder()
                .type(ChatMessage.MessageType.JOIN)
                .senderId(user.getId())
                .senderEmail(user.getEmail())
                .senderName(user.getName())
                .senderLastName(user.getLastName())
                .senderRole(user.getRole().name())
                .build();
    }

    public ChatMessage sendMessage(ChatMessage message,
                                   SimpMessageHeaderAccessor headerAccessor
    ) {
        User user = (User) headerAccessor.getSessionAttributes().get("user");

        return ChatMessage.builder()
                .type(ChatMessage.MessageType.CHAT)
                .message(message.getMessage())
                .senderId(user.getId())
                .senderEmail(user.getEmail())
                .senderName(user.getName())
                .senderLastName(user.getLastName())
                .senderRole(user.getRole().name())
                .build();
    }

    public User removeUser(String sessionId) {
        return sessionUserMap.remove(sessionId);
    }

    public List<User> getAllConnectedUsers() {
        return sessionUserMap.values().stream().toList();
    }
}
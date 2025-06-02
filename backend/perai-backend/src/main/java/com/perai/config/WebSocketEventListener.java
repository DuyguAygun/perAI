package com.perai.config;

import com.perai.dto.ChatMessage;
import com.perai.model.User;
import com.perai.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final ChatService chatService;

    @EventListener
    public void handleWebSocketDisconnectListener(
            @AuthenticationPrincipal
            SessionDisconnectEvent event
    ) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        User user = chatService.removeUser(sessionId);

        if (user != null) {
            log.info("User disconnected: {}", user.getName());

            ChatMessage message = ChatMessage.builder()
                    .type(ChatMessage.MessageType.LEAVE)
                    .senderId(user.getId())
                    .senderEmail(user.getEmail())
                    .senderName(user.getName())
                    .senderLastName(user.getLastName())
                    .senderRole(user.getRole().name())
                    .build();

            messageTemplate.convertAndSend("/topic/public", message);
        }
    }
}
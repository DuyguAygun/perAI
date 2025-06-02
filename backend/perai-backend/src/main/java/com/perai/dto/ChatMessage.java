package com.perai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String message;
    private Long senderId;
    private String senderEmail;
    private String senderName;
    private String senderLastName;
    private String senderRole;
    private MessageType type;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
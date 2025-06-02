package com.perai.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AIRequest {
    @NotNull(message = "Message can not be null!")
    @NotEmpty(message = "Message can not be empty!")
    private String message;
}
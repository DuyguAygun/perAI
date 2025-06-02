package com.perai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GuessGame {

    @NotNull(message = "Word can not be null")
    @NotBlank(message = "Word can not be blank")
    private String word;
}
package com.perai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InformationBody {
    private String message;
    private int status;
    private Long timestamp;
}
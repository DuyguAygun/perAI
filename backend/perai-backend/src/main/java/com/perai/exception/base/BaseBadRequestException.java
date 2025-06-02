package com.perai.exception.base;

import org.springframework.http.HttpStatus;

public class BaseBadRequestException extends BaseException {
    public BaseBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
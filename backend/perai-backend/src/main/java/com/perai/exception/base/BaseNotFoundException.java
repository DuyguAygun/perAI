package com.perai.exception.base;

import org.springframework.http.HttpStatus;

public class BaseNotFoundException extends BaseException {
    public BaseNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
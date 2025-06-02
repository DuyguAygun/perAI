package com.perai.exception;

import com.perai.exception.base.BaseBadRequestException;

public class JwtBadRequestException extends BaseBadRequestException {
    public JwtBadRequestException(String message) {
        super(message);
    }
}

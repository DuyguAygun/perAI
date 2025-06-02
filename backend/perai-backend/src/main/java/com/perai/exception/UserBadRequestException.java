package com.perai.exception;

import com.perai.exception.base.BaseBadRequestException;

public class UserBadRequestException extends BaseBadRequestException {
    public UserBadRequestException(String message) {
        super(message);
    }
}

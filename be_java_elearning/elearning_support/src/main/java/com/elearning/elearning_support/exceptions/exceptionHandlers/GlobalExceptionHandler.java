package com.elearning.elearning_support.exceptions.exceptionHandlers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.elearning.elearning_support.exceptions.BadRequestException;
import com.elearning.elearning_support.exceptions.ExceptionResponse;
import com.elearning.elearning_support.exceptions.PermissionDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Listen and handle BadRequestException
     */
    @ExceptionHandler({BadRequestException.class})
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ExceptionResponse handlerBadRequestException(BadRequestException exception) {
        return new ExceptionResponse(exception.getCode(), HttpStatus.BAD_REQUEST.value(), exception.getMessage(), exception.getFieldError());
    }

    /**
     * Listen and handle PermissionDeniedException
     */
    @ExceptionHandler({PermissionDeniedException.class})
    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    public ExceptionResponse handlerPermissionDeniedException(PermissionDeniedException exception) {
        return new ExceptionResponse(exception.getCode(), HttpStatus.FORBIDDEN.value(), exception.getMessage());
    }

//    @ExceptionHandler({BadRequestException.class})
//    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
//    public ExceptionResponse handlerBadCredentialsException(BadCredentialsException exception) {
//        return new ExceptionResponse(User.BAD_CREDENTIALS_ERROR_CODE, HttpStatus.UNAUTHORIZED.value(), exception.getMessage(),
//            User.USERNAME + "/" + User.PASSWORD);
//    }

}

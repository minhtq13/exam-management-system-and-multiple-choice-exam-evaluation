package com.demo.app.exception;

import com.demo.app.dto.message.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleMethodArgumentNotValid(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return errors;
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEntityNotFoundExceptions(EntityNotFoundException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(DuplicatedUniqueValueException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDuplicatedUniqueValueException(DuplicatedUniqueValueException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(FileInputException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    public ErrorResponse handleIOException(FileInputException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(InvalidVerificationTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleInvalidVerificationTokenException(InvalidVerificationTokenException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(InvalidRoleException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleInvalidRoleException(InvalidRoleException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(InvalidArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidArgumentException(InvalidArgumentException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(UserNotEnrolledException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleUserNotEnrolledException(UserNotEnrolledException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

    @ExceptionHandler(UserNotSignInException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleUserNotSignInException(UserNotSignInException ex){
        HttpStatus status = ex.getStatus();
        return new ErrorResponse(status, ex.getMessage());
    }

}

package com.elearning.elearning_support.exceptions;

import com.elearning.elearning_support.utils.DateUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExceptionResponse {

    private String code;

    private Integer status;

    private String message;

    private String fieldError;

    private Long timestamp = DateUtils.getCurrentDateTime().getTime();

    public ExceptionResponse(String code,Integer status, String message, String fieldError) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.fieldError = fieldError;
    }

    public ExceptionResponse(String code, Integer status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
}

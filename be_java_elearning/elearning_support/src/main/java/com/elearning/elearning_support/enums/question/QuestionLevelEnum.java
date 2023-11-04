package com.elearning.elearning_support.enums.question;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum QuestionLevelEnum {

    ALL(-1, "Tât cả"),

    EASY(0,"Dễ"),

    MEDIUM(1,"Trung bình"),

    HARD(2,"Khó");


    private final Integer level;

    private final String levelName;

    }

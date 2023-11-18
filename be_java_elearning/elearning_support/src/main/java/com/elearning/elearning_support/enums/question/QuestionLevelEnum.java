package com.elearning.elearning_support.enums.question;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum QuestionLevelEnum {

    ALL(-1, "Tât cả"),

    EASY(0, "Dễ"),

    MEDIUM(1, "Trung bình"),

    HARD(2, "Khó");


    private final Integer level;

    private final String levelName;

    private static final Map<String, QuestionLevelEnum> mapLevelByName = new HashMap<>();

    static {
        for (QuestionLevelEnum level : QuestionLevelEnum.values()) {
            mapLevelByName.put(level.toString().toLowerCase(), level);
        }
    }

    /**
     * get question level by test name (for import)
     */
    public static QuestionLevelEnum getQuestionLevelByName(String levelName) {
        return mapLevelByName.get(levelName.toLowerCase());
    }


}

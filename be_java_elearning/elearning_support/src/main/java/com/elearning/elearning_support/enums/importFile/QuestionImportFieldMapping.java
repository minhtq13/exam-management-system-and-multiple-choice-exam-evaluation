package com.elearning.elearning_support.enums.importFile;

import java.util.LinkedHashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum QuestionImportFieldMapping {

    CONTENT("content", "content"),
    LEVEL("level", "levelRaw"),
    CHAPTER_NO ("chapterNo", "chapterNo"),
    SUBJECT("subjectCode", "subjectCode"),
    ANSWER1("answer1", "firstAnswer"),
    ANSWER2("answer2", "secondAnswer"),
    ANSWER3("answer3", "thirdAnswer"),
    ANSWER4("answer4", "fourthAnswer"),
    CORRECT_ANSWERS("correctAnswers", "correctAnswers");

    private final String excelColumnKey;

    private final String objectFieldKey;

    private final static Map<String, QuestionImportFieldMapping> mapFields = new LinkedHashMap<>();

    static {
        for (QuestionImportFieldMapping fieldMap : QuestionImportFieldMapping.values()){
            mapFields.put(fieldMap.excelColumnKey, fieldMap);
        }
    }

    /**
     * Lấy object keymap khi import
     */
    public static String getObjectFieldByColumnKey(String columnKey) {
        return mapFields.get(columnKey).objectFieldKey;
    }

}

package com.elearning.elearning_support.enums.importFile;

import java.util.LinkedHashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TeacherImportFieldMapping {

    USERNAME("username", "username"),
    EMAIL("email", "email"),
    PASSWORD("password", "passwordRaw"),
    FULL_NAME("fullName", "fullNameRaw"),
    BIRTHDAY("birthday", "birthDateRaw"),
    GENDER("gender", "genderRaw"),
    PHONE("phoneNumber", "phoneNumber"),
    CODE("code", "code");

    private final String excelColumnKey;

    private final String objectFieldKey;

    private final static Map<String, TeacherImportFieldMapping> mapFields = new LinkedHashMap<>();

    static {
        for (TeacherImportFieldMapping fieldMap : TeacherImportFieldMapping.values()){
            mapFields.put(fieldMap.excelColumnKey, fieldMap);
        }
    }

    /**
     * Lấy object keymap khi import
     */
    public static String getObjectFieldMapByColumnKey(String columnKey) {
        return mapFields.get(columnKey).getObjectFieldKey();
    }
}

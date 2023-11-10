package com.elearning.elearning_support.enums.importFieldMap;

import java.util.HashMap;
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
    FULLNAME("fullname", "fullnameRaw"),
    BIRTHDAY("birthday", "birthDateRaw"),
    GENDER("gender", "genderRaw"),
    PHONE("phone", "phoneNumber"),
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

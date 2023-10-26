package com.elearning.elearning_support.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : Chien Dao - HUST
 * @version 1.0
 */
public class StringUtils {

    /**
     * Covert string long array '{0,1,2,...}' to Set<Long> in Java
     */
    public static Set<Long> convertStrLongArrayToSetLong(String longArray) {
        if (longArray == null) {
            return new HashSet<>();
        }
        return Arrays.
            stream(longArray.replace("{", "").replace("}", "").split(","))
            .map(Long::valueOf)
            .collect(Collectors.toSet());
    }


    /**
     * Convert string in vietnamese to english : "Chiến Đào" -> "Chien Dao"
     */
    public static String convertVietnameseToEng(String vietnamese){
        // lower case
        vietnamese = vietnamese.replaceAll("à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
        vietnamese = vietnamese.replaceAll("è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
        vietnamese = vietnamese.replaceAll("ì|í|ị|ỉ|ĩ", "i");
        vietnamese = vietnamese.replaceAll("ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
        vietnamese = vietnamese.replaceAll("ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
        vietnamese = vietnamese.replaceAll("ỳ|ý|ỵ|ỷ|ỹ", "y");
        vietnamese = vietnamese.replaceAll("đ", "d");

        // upper case
        vietnamese = vietnamese.replaceAll("À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A");
        vietnamese = vietnamese.replaceAll("È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E");
        vietnamese = vietnamese.replaceAll("Ì|Í|Ị|Ỉ|Ĩ", "I");
        vietnamese = vietnamese.replaceAll("Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O");
        vietnamese = vietnamese.replaceAll("Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U");
        vietnamese = vietnamese.replaceAll("Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y");
        vietnamese = vietnamese.replaceAll("Đ", "D");
        return vietnamese;
    }

    /**
     * Convert Java String -> SQL text
     */
    public static String formatSqlText(String text) {
        return "'" + text + "'";
    }

}

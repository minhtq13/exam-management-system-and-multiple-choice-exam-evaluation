package com.elearning.elearning_support.utils.tests;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class TestUtils {

    public static Integer DEFAULT_DURATION = 60;

    public static Map<String, Integer> mapAnswer = new HashMap<>();

    static {
        mapAnswer.put("A", 1);
        mapAnswer.put("B", 2);
        mapAnswer.put("C", 3);
        mapAnswer.put("D", 4);
        mapAnswer.put("E", 5);
        mapAnswer.put("F", 6);
    }


    /**
     * Convert selected answer from text to integer
     */
    public static Set<Integer> getSelectedAnswer(String selectedAnswers) {
        if(Objects.equals(selectedAnswers, ""))
            return new HashSet<>();
        return Arrays.stream(selectedAnswers.trim().split("")).map(item -> mapAnswer.get(item)).collect(Collectors.toSet());
    }

}

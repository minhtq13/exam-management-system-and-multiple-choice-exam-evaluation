package com.elearning.elearning_support.utils.object;

import java.util.Objects;

public class ObjectUtil {

    public static <T> T getOrDefault(T value, T defaultValue) {
        return Objects.nonNull(value) ? value : defaultValue;
    }

}

package com.elearning.elearning_support.enums.commons;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TimeIntervalEnum {

    DAY(1, "day"),
    WEEK(2, "week"),
    MONTH(3, "month"),
    QUARTER(4, "quarter"),
    YEAR(5, "year");

    private final Integer type;
    private final String name;
}

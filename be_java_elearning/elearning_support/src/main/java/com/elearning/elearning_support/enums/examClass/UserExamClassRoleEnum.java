package com.elearning.elearning_support.enums.examClass;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserExamClassRoleEnum {

    STUDENT(0, "Thí sinh/SV"),
    SUPERVISOR(1, "Giám thị");

    private final Integer type;
    private final String name;

}

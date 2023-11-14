package com.elearning.elearning_support.dtos.examClass;

import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

public interface ICommonExamClassDTO {

    Long getId();

    String getCode();

    String getRoomName();

    Integer getNumberOfSupervisors();

    Integer getNumberOfStudents();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    String getExamineTime();

    String getSemester();


    Long getTestId();

    String getTestName();

    String getSubjectTitle();

}

package com.elearning.elearning_support.dtos.examClass;

import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

public interface ICommonExamClassDTO {

    Long getId();

    String getCode();

    String getRoomName();

    Integer getNumberOfSupervisors();

    Integer getNumberOfStudents();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    String getExamineTime();

    @Schema(description = "Id kỳ học")
    Long getSemesterId();

    String getSemester();


    Long getTestId();

    String getTestName();

    @Schema(description = "Id môn học")
    Long getSubjectId();

    String getSubjectTitle();

}

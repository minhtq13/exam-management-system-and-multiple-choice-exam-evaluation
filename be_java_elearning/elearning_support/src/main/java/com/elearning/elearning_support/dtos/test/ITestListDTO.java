package com.elearning.elearning_support.dtos.test;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

public interface ITestListDTO {

    Long getId();

    String getName();

    Integer getDuration();

    Integer getQuestionQuantity();

    String getSubjectName();

    String getSubjectCode();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM_SS, timezone = DateUtils.TIME_ZONE)
    Date getCreatedAt();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM_SS, timezone = DateUtils.TIME_ZONE)
    Date getModifiedAt();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date getStartTime();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date getEndTime();


}

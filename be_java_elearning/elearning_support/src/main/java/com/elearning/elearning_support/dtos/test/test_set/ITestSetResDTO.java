package com.elearning.elearning_support.dtos.test.test_set;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

public interface ITestSetResDTO {

    Long getTestSetId();

    Long getTestId();

    String getTestName();

    String getSubjectTitle();

    String getSubjectCode();

    Integer getQuestionQuantity();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date getCreatedAt();

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date getModifiedAt();
}

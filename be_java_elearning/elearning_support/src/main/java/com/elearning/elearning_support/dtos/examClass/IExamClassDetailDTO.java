package com.elearning.elearning_support.dtos.examClass;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;

public interface IExamClassDetailDTO extends ICommonExamClassDTO {

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YY_HH_MM_SS, timezone = DateUtils.TIME_ZONE)
    Date getLastModifiedAt();

}

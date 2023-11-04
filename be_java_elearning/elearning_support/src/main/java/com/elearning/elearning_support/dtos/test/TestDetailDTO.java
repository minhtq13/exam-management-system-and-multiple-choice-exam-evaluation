package com.elearning.elearning_support.dtos.test;

import java.util.Date;
import com.elearning.elearning_support.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestDetailDTO {

    @Schema(description = "Id kỳ thi")
    Long id;

    @Schema(description = "Tên kỳ thi")
    String name;

    Long subjectId;

    String subjectName;

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date startTime;

    @JsonFormat(pattern = DateUtils.FORMAT_DATE_DD_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date endTime;

    Integer totalPoint;

    Integer duration;


}

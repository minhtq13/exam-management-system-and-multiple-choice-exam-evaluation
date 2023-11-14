package com.elearning.elearning_support.dtos.examClass;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotNull;
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
public class ExamClassSaveReqDTO {

    @Schema(description = "Phòng thi")
    String roomName;

    @Schema(description = "Thời gian thi")
    @JsonFormat(pattern = DateUtils.FORMAT_DATE_HH_MM_YYYY_HH_MM, timezone = DateUtils.TIME_ZONE)
    Date examineTime;

    @NotNull
    @Schema(description = "Id kỳ thi")
    Long testId;

    @Schema(description = "Danh sách Id giám thị")
    Set<Long> lstSupervisorId = new HashSet<>();

    @Schema(description = "Danh sách id thí sinh")
    Set<Long> lstStudentId = new HashSet<>();

}

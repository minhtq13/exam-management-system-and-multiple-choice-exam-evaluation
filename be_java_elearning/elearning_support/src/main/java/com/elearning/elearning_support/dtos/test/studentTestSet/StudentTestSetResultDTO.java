package com.elearning.elearning_support.dtos.test.studentTestSet;

import org.springframework.beans.BeanUtils;
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
public class StudentTestSetResultDTO {

    @Schema(description = "Id bản ghi student_test_set")
    Long id;

    @Schema(description = "Id thí sinh")
    Long studentId;

    @Schema(description = "Tên thí sinh")
    String studentName;

    @Schema(description = "Id đề thi")
    Long testSetId;

    @Schema(description = "Mã đề thi")
    String testSetCode;

    @Schema(description = "Id lớp thi")
    Long examClassId;

    @Schema(description = "Mã lớp thi")
    String examClassCode;

    // result

    @Schema(description = "Số câu đã tô phương án trả lời")
    Integer numMarkedAnswers;

    @Schema(description = "Số câu trả lời đúng")
    Integer numCorrectAnswers = 0;

    @Schema(description = "Tổng số điểm")
    Double totalPoints = 0.0;

    @Schema(description = "Đường dẫn ảnh phiếu trả lời")
    String handledSheetImg;

    public StudentTestSetResultDTO(IStudentTestSetResultDTO iStudentTestSetResultDTO, Long examClassId, String examClassCode) {
        BeanUtils.copyProperties(iStudentTestSetResultDTO, this);
        this.examClassId = examClassId;
        this.examClassCode = examClassCode;
    }
}

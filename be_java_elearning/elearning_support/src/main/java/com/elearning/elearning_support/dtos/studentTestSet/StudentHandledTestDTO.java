package com.elearning.elearning_support.dtos.studentTestSet;

import java.util.List;
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
public class StudentHandledTestDTO {

    @Schema(description = "Mã lớp thi")
    String examClassCode;

    @Schema(description = "Mã thí sinh")
    String studentCode;

    @Schema(description = "Mã đề thi")
    String testCode;

    @Schema(description = "Các câu trả lời của các câu hỏi")
    List<HandledAnswerDTO> answers;




}

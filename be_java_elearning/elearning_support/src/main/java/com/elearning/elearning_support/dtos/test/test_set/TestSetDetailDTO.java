package com.elearning.elearning_support.dtos.test.test_set;

import java.util.List;
import com.elearning.elearning_support.dtos.test.test_question.TestQuestionAnswerResDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class TestSetDetailDTO {

    @Schema(description = "Thông tin đề thi")
    ITestSetResDTO testSet;

    @JsonProperty("questions")
    @Schema(description = "Danh sách câu hỏi trong đề thi")
    List<TestQuestionAnswerResDTO> lstQuestion;












}

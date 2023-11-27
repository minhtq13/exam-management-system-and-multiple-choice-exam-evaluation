package com.elearning.elearning_support.dtos.test.test_question;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.BeanUtils;
import com.elearning.elearning_support.dtos.fileAttach.FileAttachDTO;
import com.elearning.elearning_support.dtos.test.test_set.TestSetAnswerResDTO;
import com.elearning.elearning_support.utils.object.ObjectMapperUtil;
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
public class TestQuestionAnswerResDTO {

    Long id;

    String content;

    Integer level;

    @Schema(description = "File ảnh của câu hỏi")
    List<FileAttachDTO> images = new ArrayList<>();

    Integer questionNo;

    @Schema(description = "Danh sách câu trả lời kèm theo thứ tự")
    List<TestSetAnswerResDTO> answers;

    public TestQuestionAnswerResDTO(ITestQuestionAnswerResDTO iTestQuestionAnswerResDTO){
        BeanUtils.copyProperties(iTestQuestionAnswerResDTO, this);
        // Map list answer and sort by answer no
        this.answers = ObjectMapperUtil.listMapper(iTestQuestionAnswerResDTO.getLstAnswerJson(), TestSetAnswerResDTO.class);
        // Map question images
        this.images = ObjectMapperUtil.listMapper(iTestQuestionAnswerResDTO.getLstImageJson(), FileAttachDTO.class);
    }


}

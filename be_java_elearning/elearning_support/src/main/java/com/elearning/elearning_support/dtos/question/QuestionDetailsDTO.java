package com.elearning.elearning_support.dtos.question;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.BeanUtils;
import com.elearning.elearning_support.dtos.answer.AnswerResDTO;
import com.elearning.elearning_support.dtos.fileAttach.FileAttachDTO;
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
public class QuestionDetailsDTO {

    @Schema(description = "Id câu hỏi")
    Long id;

    @Schema(description = "Nội dung câu hỏi")
    String content;

    @Schema(description = "Mã số câu hỏi")
    String code;

    @Schema(description = "Id môn học")
    Long subjectId;

    @Schema(description = "Tiêu đề môn học")
    String subjectTitle;

    @Schema(description = "Id chương")
    Long chapterId;

    @Schema(description = "Tiêu đề chương")
    String chapterTitle;

    @Schema(description = "Danh sách đáp án trả lời")
    List<AnswerResDTO> lstAnswer = new ArrayList<>();

    @Schema(description = "File ảnh của câu hỏi")
    List<FileAttachDTO> lstImage = new ArrayList<>();

    public QuestionDetailsDTO(IQuestionDetailsDTO iQuestionDetailsDTO) {
        BeanUtils.copyProperties(iQuestionDetailsDTO, this);
        this.lstAnswer = ObjectMapperUtil.listMapper(iQuestionDetailsDTO.getLstAnswerJson(), AnswerResDTO.class);
        this.lstImage = ObjectMapperUtil.listMapper(iQuestionDetailsDTO.getLstImageJson(), FileAttachDTO.class);
    }

}

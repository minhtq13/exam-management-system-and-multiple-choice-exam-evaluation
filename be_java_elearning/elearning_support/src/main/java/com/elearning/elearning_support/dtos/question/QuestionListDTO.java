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
public class QuestionListDTO {

    @Schema(description = "Id câu hỏi")
    Long id;

    @Schema(description = "Nội dung câu hỏi")
    String content;

    @Schema(description = "Mã câu hỏi")
    String code;

    @Schema(description = "Mức độ câu hỏi")
    Integer level;

    @Schema(description = "File ảnh của câu hỏi")
    List<FileAttachDTO> lstImage = new ArrayList<>();

    @Schema(description = "Câu trả lời của câu hỏi")
    List<AnswerResDTO> lstAnswer = new ArrayList<>();

    public QuestionListDTO(IListQuestionDTO iListQuestionDTO) {
        BeanUtils.copyProperties(iListQuestionDTO, this);
        this.lstImage = ObjectMapperUtil.listMapper(iListQuestionDTO.getLstImageJson(), FileAttachDTO.class);
        this.lstAnswer = ObjectMapperUtil.listMapper(iListQuestionDTO.getLstAnswerJson(), AnswerResDTO.class);
    }

}

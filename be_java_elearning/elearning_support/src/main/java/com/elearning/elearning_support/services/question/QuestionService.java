package com.elearning.elearning_support.services.question;

import java.util.List;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.question.QuestionListCreateDTO;
import com.elearning.elearning_support.dtos.question.QuestionListDTO;
import com.elearning.elearning_support.dtos.question.QuestionUpdateDTO;

@Service
public interface QuestionService {

    void createListQuestion(QuestionListCreateDTO createDTO);

    void updateQuestion (Long questionId, QuestionUpdateDTO updateDTO);

    List<QuestionListDTO> getListQuestion(Long subjectId, String subjectCode, Long chapterId, String chapterCode);



}

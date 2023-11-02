package com.elearning.elearning_support.services.question.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.question.QuestionListCreateDTO;
import com.elearning.elearning_support.dtos.question.QuestionListDTO;
import com.elearning.elearning_support.dtos.question.QuestionUpdateDTO;
import com.elearning.elearning_support.entities.answer.Answer;
import com.elearning.elearning_support.entities.question.Question;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.answer.AnswerRepository;
import com.elearning.elearning_support.repositories.question.QuestionRepository;
import com.elearning.elearning_support.services.question.QuestionService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    private final AnswerRepository answerRepository;

    private final ExceptionFactory exceptionFactory;

    @Transactional
    @Override
    public void createListQuestion(QuestionListCreateDTO createDTO) {
        // Tạo các list để lưu question
        List<Question> lstQuestion = new ArrayList<>();
        createDTO.getLstQuestion().forEach(questionDTO -> {
            Question question = Question.builder()
                .imageId(questionDTO.getImageId())
                .level(questionDTO.getLevel().getLevel())
                .chapterId(createDTO.getChapterId())
                .content(questionDTO.getContent())
                .code(generateQuestionCode())
                .build();
            question.setCreatedAt(new Date());
            question.setCreatedBy(AuthUtils.getCurrentUserId());
            // Save question
            lstQuestion.add(question);
            // Tạo các answer của question
            question.setLstAnswer(questionDTO.getLstAnswer().stream().map(Answer::new).collect(Collectors.toList()));
        });
        // save question
        questionRepository.saveAll(lstQuestion);
    }

    @Transactional
    @Override
    public void updateQuestion(Long questionId, QuestionUpdateDTO updateDTO) {
        Question question = questionRepository.findById(questionId).orElseThrow(
                () -> exceptionFactory.resourceExistedException(ErrorKey.Question.NOT_FOUND, Resources.QUESTION, MessageConst.RESOURCE_NOT_FOUND,
                    ErrorKey.Question.ID, String.valueOf(questionId)));
        // Set thông tin cập nhất question
        question.setContent(updateDTO.getContent());
        question.setLevel(updateDTO.getLevel().getLevel());
        question.setModifiedAt(new Date());
        question.setModifiedBy(AuthUtils.getCurrentUserId());
        //xoá tất cả các answer của question hiện tại
        answerRepository.deleteAllByQuestionId(questionId);
        // Lưu list answer mới
        List<Answer> lstUpdatedAnswer = updateDTO.getLstAnswer().stream().map(Answer::new).collect(Collectors.toList());
        question.setLstAnswer(lstUpdatedAnswer);
        questionRepository.save(question);
    }

    @Override
    public List<QuestionListDTO> getListQuestion(Long subjectId, String subjectCode, Long chapterId, String chapterCode) {
        return questionRepository.getListQuestion(subjectId, subjectCode, chapterId, chapterCode).stream().map(QuestionListDTO::new).collect(
            Collectors.toList());
    }

    /**
     * Generate question code
     */
    private String generateQuestionCode(){
        String baseCode = "Q";
        Random random = new Random();
        String generatedCode = baseCode + (random.nextInt(900000) + 100000);
        while (questionRepository.existsByCode(generatedCode)) {
            generatedCode = baseCode + (random.nextInt(900000) + 100000);
        }
        return generatedCode;
    }
}

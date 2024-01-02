package com.elearning.elearning_support.repositories.question;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLQuestion;
import com.elearning.elearning_support.dtos.question.IListQuestionDTO;
import com.elearning.elearning_support.dtos.question.IQuestionAnswerDTO;
import com.elearning.elearning_support.dtos.question.IQuestionDetailsDTO;
import com.elearning.elearning_support.entities.question.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Boolean existsByCode(String code);

    @Query(nativeQuery = true, value = SQLQuestion.GET_LIST_QUESTION)
    List<IListQuestionDTO> getListQuestion(Long subjectId, String subjectCode, Set<Long> chapterIds, String chapterCode, Integer questionLevel,
        String search);

    @Query(nativeQuery = true, value = SQLQuestion.GET_LIST_QUESTION_ID_BY_CHAPTER_ID_IN)
    Set<Long> getListQuestionIdByChapterIn(Set<Long> lstChapterId);

    @Query(nativeQuery = true, value = SQLQuestion.GET_LIST_QUESTION_IN_TEST)
    Set<IQuestionAnswerDTO> getListQuestionInTest(Long testId);

    @Query(nativeQuery = true, value = SQLQuestion.GET_QUESTION_DETAILS)
    IQuestionDetailsDTO getQuestionDetails(Long questionId);

}

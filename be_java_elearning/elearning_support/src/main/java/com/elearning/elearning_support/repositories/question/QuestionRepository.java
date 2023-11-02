package com.elearning.elearning_support.repositories.question;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLQuestion;
import com.elearning.elearning_support.dtos.question.IListQuestionDTO;
import com.elearning.elearning_support.entities.question.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Boolean existsByCode(String code);

    @Query(nativeQuery = true, value = SQLQuestion.GET_LIST_QUESTION)
    List<IListQuestionDTO> getListQuestion(Long subjectId, String subjectCode, Long chapterId, String chapterCode);

}

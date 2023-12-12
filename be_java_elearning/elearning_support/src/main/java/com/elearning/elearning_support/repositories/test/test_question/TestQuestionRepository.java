package com.elearning.elearning_support.repositories.test.test_question;

import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.entities.test.TestQuestion;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

    Set<TestQuestion> findAllByTestId(Long testId);

    @Transactional
    @Modifying
    void deleteAllByTestIdAndQuestionIdIn(Long testId, Set<Long> questionIds);


    @Transactional
    @Modifying
    void deleteAllByQuestionId(Long questionId);

}

package com.elearning.elearning_support.repositories.test.test_set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.entities.test.TestSetQuestion;

@Repository
public interface TestSetQuestionRepository extends JpaRepository<TestSetQuestion, Long> {

    @Transactional
    @Modifying
    void deleteAllByTestSetId(Long testSetId);

}

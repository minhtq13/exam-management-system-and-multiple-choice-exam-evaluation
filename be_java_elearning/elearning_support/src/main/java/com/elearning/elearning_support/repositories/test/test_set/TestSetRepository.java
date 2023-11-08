package com.elearning.elearning_support.repositories.test.test_set;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLTest;
import com.elearning.elearning_support.dtos.test.test_question.ITestQuestionAnswerResDTO;
import com.elearning.elearning_support.dtos.test.test_set.ITestSetResDTO;
import com.elearning.elearning_support.entities.test.TestSet;

@Repository
public interface TestSetRepository extends JpaRepository<TestSet, Long> {

    @Query(nativeQuery = true, value = SQLTest.GET_TEST_SET_DETAILS)
    ITestSetResDTO getTestSetDetail(Long testId, String code);

    @Query(nativeQuery = true, value = SQLTest.GET_LIST_TEST_SET_QUESTION)
    List<ITestQuestionAnswerResDTO> getListTestSetQuestion(Long testSetId);

    Boolean existsByIdAndIsEnabled(Long id, Boolean isEnabled);
}

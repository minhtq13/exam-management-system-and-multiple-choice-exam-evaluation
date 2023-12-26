package com.elearning.elearning_support.repositories.test.test_set;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLStudentTestSet;
import com.elearning.elearning_support.dtos.test.studentTestSet.IStudentTestSetResultDTO;
import com.elearning.elearning_support.entities.studentTest.StudentTestSet;

@Repository
public interface StudentTestSetRepository extends JpaRepository<StudentTestSet, Long> {

    @Query(nativeQuery = true, value = SQLStudentTestSet.GET_LIST_STUDENT_TEST_SET_RESULT)
    List<IStudentTestSetResultDTO> getStudentTestSetResult(Set<Long> studentIds, Set<Long> testSetIds);

    List<StudentTestSet> findAllByStudentIdInAndTestSetIdIn(Set<Long> studentIds, Set<Long> testSetIds);

}

package com.elearning.elearning_support.repositories.test.test_set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.studentTest.StudentTestSet;

@Repository
public interface StudentTestSetRepository extends JpaRepository<StudentTestSet, Long> {

}

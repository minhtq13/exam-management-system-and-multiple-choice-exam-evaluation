package com.elearning.elearning_support.repositories.test.test_set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.test.TestSet;

@Repository
public interface TestSetRepository extends JpaRepository<TestSet, Long> {


}

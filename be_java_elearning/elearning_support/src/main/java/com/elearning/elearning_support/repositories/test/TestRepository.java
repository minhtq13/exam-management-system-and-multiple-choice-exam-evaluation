package com.elearning.elearning_support.repositories.test;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.elearning.elearning_support.constants.sql.SQLTest;
import com.elearning.elearning_support.dtos.test.ITestListDTO;
import com.elearning.elearning_support.entities.test.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

    Optional<Test> findByIdAndIsEnabled(Long id, Boolean isEnabled);

    Boolean existsByIdAndIsEnabled(Long id, Boolean isEnabled);


    @Query(nativeQuery = true, value = SQLTest.GET_LIST_TEST)
    List<ITestListDTO> getListTest(Long subjectId, String subjectCode, Date startTime, Date endTime);

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = SQLTest.SWITCH_TEST_STATUS)
    void switchTestStatus(Long testId, Boolean isEnabled);

}

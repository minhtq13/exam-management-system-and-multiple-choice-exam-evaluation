package com.elearning.elearning_support.repositories.examClass;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.exam_class.ExamClass;

@Repository
public interface ExamClassRepository extends JpaRepository<ExamClass, Long> {

}

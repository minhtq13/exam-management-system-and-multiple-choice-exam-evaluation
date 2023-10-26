package com.demo.app.repository;

import com.demo.app.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, TestQuestion.TestQuestionIds> {
}

package com.elearning.elearning_support.repositories.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.question.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

}

package com.elearning.elearning_support.repositories.subject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.subject.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

}

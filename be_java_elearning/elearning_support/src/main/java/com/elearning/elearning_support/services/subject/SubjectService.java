package com.elearning.elearning_support.services.subject;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.entities.subject.Subject;

@Service
public interface SubjectService {

    Subject findById(Long subjectId);

}

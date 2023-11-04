package com.elearning.elearning_support.services.subject.impl;

import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.message.errorKey.ErrorKey;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.entities.subject.Subject;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.subject.SubjectRepository;
import com.elearning.elearning_support.services.subject.SubjectService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    private final ExceptionFactory exceptionFactory;

    @Override
    public Subject findById(Long subjectId) {
        return subjectRepository.findByIdAndIsEnabled(subjectId, Boolean.TRUE).orElseThrow(() ->
            exceptionFactory.resourceExistedException(MessageConst.Subject.NOT_FOUND, MessageConst.RESOURCE_NOT_FOUND, Resources.SUBJECT,
                ErrorKey.Subject.ID, String.valueOf(subjectId)));
    }
}

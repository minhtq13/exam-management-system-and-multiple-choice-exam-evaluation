package com.elearning.elearning_support.services.comboBox.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.constants.RoleConstants;
import com.elearning.elearning_support.dtos.common.ICommonIdCode;
import com.elearning.elearning_support.dtos.common.ICommonIdCodeName;
import com.elearning.elearning_support.enums.users.UserTypeEnum;
import com.elearning.elearning_support.repositories.comboBox.ComboBoxRepository;
import com.elearning.elearning_support.services.comboBox.ComboBoxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ComboBoxServiceImpl implements ComboBoxService {

    private final ComboBoxRepository comboBoxRepository;

    @Override
    public List<ICommonIdCodeName> getListSubject(String subjectName, String subjectCode) {
        return comboBoxRepository.getListSubject(subjectName, subjectCode);
    }

    @Override
    public List<ICommonIdCodeName> getListChapterInSubject(Long subjectId, String chapterTitle, String chapterCode) {
        return comboBoxRepository.getListChapterInSubject(subjectId, chapterTitle, chapterCode);
    }

    @Override
    public List<ICommonIdCodeName> getListStudent(String studentName, String studentCode) {
        return comboBoxRepository.getListUserWithUserTypeAndRoleBase(studentName, studentCode, UserTypeEnum.STUDENT.getType(),
            RoleConstants.ROLE_STUDENT);
    }

    @Override
    public List<ICommonIdCodeName> getListTeacher(String teacherName, String teacherCode) {
        return comboBoxRepository.getListUserWithUserTypeAndRoleBase(teacherName, teacherCode, UserTypeEnum.TEACHER.getType(),
            RoleConstants.ROLE_TEACHER);
    }

    @Override
    public List<ICommonIdCodeName> getListRole(String search, UserTypeEnum userType) {
        return comboBoxRepository.getListRole(search, userType.getType());
    }

    @Override
    public List<ICommonIdCodeName> getListSemester(String search) {
        return comboBoxRepository.getListSemester(search);
    }

    @Override
    public List<ICommonIdCodeName> getListTest(String search) {
        return comboBoxRepository.getListTest(search);
    }

    @Override
    public List<ICommonIdCode> getListExamClass(Long semesterId, Long subjectId, String search) {
        return comboBoxRepository.getListExamClass(semesterId, subjectId, search);
    }
}

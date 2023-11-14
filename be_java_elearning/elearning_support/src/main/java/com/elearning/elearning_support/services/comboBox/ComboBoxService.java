package com.elearning.elearning_support.services.comboBox;

import java.util.List;
import org.springframework.stereotype.Service;
import com.elearning.elearning_support.dtos.common.ICommonIdCodeName;
import com.elearning.elearning_support.enums.users.UserTypeEnum;

@Service
public interface ComboBoxService {


    /**
     * Danh sách (id, name, code) của các môn học
     */
    List<ICommonIdCodeName> getListSubject(String subjectTitle, String subjectCode);


    /**
     * Danh sách (id, name, code) của các chương trong môn học
     */
    List<ICommonIdCodeName> getListChapterInSubject(Long subjectId, String chapterTitle, String chapterCode);


    /**
     * Danh sách HSSV
     */
    List<ICommonIdCodeName> getListStudent(String studentName, String studentCode);


    /**
     * Danh sách GV
     */
    List<ICommonIdCodeName> getListTeacher(String teacherName, String teacherCode);

    /**
     * Danh sách vai trò
     */
    List<ICommonIdCodeName> getListRole(String search, UserTypeEnum userType);


}

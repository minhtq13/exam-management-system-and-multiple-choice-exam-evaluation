package com.elearning.elearning_support.repositories.comboBox;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLComboBox;
import com.elearning.elearning_support.dtos.common.ICommonIdCode;
import com.elearning.elearning_support.dtos.common.ICommonIdCodeName;
import com.elearning.elearning_support.entities.users.User;

@Repository
public interface ComboBoxRepository extends JpaRepository<User, Long> {

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_SUBJECT_COMBO_BOX)
    List<ICommonIdCodeName> getListSubject(String subjectTitle, String subjectCode);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_CHAPTER_COMBO_BOX)
    List<ICommonIdCodeName> getListChapterInSubject(Long subjectId, String chapterTitle, String chapterCode);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_USER_WITH_TYPE_COMBO_BOX)
    List<ICommonIdCodeName> getListUserWithUserTypeAndRoleBase(String name, String code, Integer userType, String roleBase);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_ROLE_WITHOUT_SUPER_ADMIN)
    List<ICommonIdCodeName> getListRole(String search, Integer userType);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_SEMESTER)
    List<ICommonIdCodeName> getListSemester(String search);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_TEST)
    List<ICommonIdCodeName> getListTest(String search);

    @Query(nativeQuery = true, value = SQLComboBox.GET_LIST_EXAM_CLASS)
    List<ICommonIdCode> getListExamClass(Long semesterId, Long subjectId, String search);


}

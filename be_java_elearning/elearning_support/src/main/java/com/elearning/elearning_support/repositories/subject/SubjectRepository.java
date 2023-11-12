package com.elearning.elearning_support.repositories.subject;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.constants.sql.SQLSubject;
import com.elearning.elearning_support.dtos.subject.ISubjectDetailDTO;
import com.elearning.elearning_support.dtos.subject.ISubjectListDTO;
import com.elearning.elearning_support.entities.subject.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {


    Optional<Subject> findByIdAndIsEnabled(Long id, Boolean isEnabled);

    Boolean existsByCode(String code);

    Boolean existsByCodeAndIdNot(String code, Long id);

    Boolean existsByIdAndIsEnabled(Long id, Boolean isEnabled);

    @Query(nativeQuery = true, value = SQLSubject.GET_LIST_SUBJECT)
    Page<ISubjectListDTO> getListSubject(String subjectTitle, String subjectCode, Long departmentId, String departmentName,
        Pageable pageable);

    @Query(nativeQuery = true, value = SQLSubject.GET_DETAIL_SUBJECT)
    ISubjectDetailDTO getDetailSubject(Long subjectId);



}

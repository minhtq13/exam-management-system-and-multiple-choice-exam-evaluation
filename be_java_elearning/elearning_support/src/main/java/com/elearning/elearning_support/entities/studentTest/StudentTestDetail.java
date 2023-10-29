package com.elearning.elearning_support.entities.studentTest;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Type;
import com.elearning.elearning_support.entities.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_test_detail", schema = "elearning_support_dev")
public class StudentTestDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "is_enabled")
    private Boolean isEnabled;

    @Column(name = "is_corrected")
    private Boolean isCorrected;

    @Column(name = "selected_answer")
    @Type(type = "com.vladmihalcea.hibernate.type.array.LongArrayType")
    private Long[] selectedAnswer;

    @NotNull
    @Column(name = "student_test_id", nullable = false)
    private Long studentTestId;

    @NotNull
    @Column(name = "test_set_question_id", nullable = false)
    private Long testSetQuestionId;

}
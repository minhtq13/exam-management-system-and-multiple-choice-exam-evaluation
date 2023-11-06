package com.elearning.elearning_support.entities.test;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import com.elearning.elearning_support.dtos.test.test_set.TestQuestionAnswer;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "test_set_question", schema = "elearning_support_dev")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class TestSetQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "test_set_id", nullable = false)
    private Long testSetId;

    @NotNull
    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @NotNull
    @Column(name = "question_no", nullable = false)
    private Integer questionNo;

    @Column(name = "lst_answer_json", columnDefinition = "jsonb")
    @Type(type = "jsonb")
    List<TestQuestionAnswer> lstAnswer;

}
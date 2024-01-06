package com.elearning.elearning_support.entities.test;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "test_question", schema = "elearning_support_dev")
public class TestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "test_id", nullable = false)
    private Long testId;

    @NotNull
    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "question_mark")
    private Double questionMark;

    public TestQuestion(Long testId, Long questionId, Double questionMark) {
        this.testId = testId;
        this.questionId = questionId;
        this.questionMark = questionMark;
    }
}
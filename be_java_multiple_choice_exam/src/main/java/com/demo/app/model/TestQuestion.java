package com.demo.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "test_question")
@IdClass(TestQuestion.TestQuestionIds.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestQuestion {

    @Id
    @ManyToOne
    private Question question;

    @Id
    @ManyToOne
    private Test test;

    @Column(name = "question_mark")
    private Double questionMark;

    @Getter
    @Setter
    @NoArgsConstructor
    @EqualsAndHashCode
    public static class TestQuestionIds implements Serializable {

        private Question question;

        private Test test;
    }

}
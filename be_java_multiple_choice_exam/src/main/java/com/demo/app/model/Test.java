package com.demo.app.model;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "test")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test extends BaseEntity {

    @Column(name = "test_day")
    private LocalDate testDay;

    @Column(name = "test_time")
    private LocalTime testTime;

    @Column(name = "question_quantity")
    private Integer questionQuantity;

    @Column(name = "total_point")
    private Integer totalPoint;

    @Column(name = "duration")
    private Integer duration;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<TestSet> testSets;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "test_question",
            joinColumns = @JoinColumn(name = "test_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "question_id", referencedColumnName = "id")
    )
    private List<Question> questions;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<ExamClass> examClasses;

    @ManyToOne
    private Subject subject;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<TestQuestion> testQuestions;

    @Override
    public String toString() {
        return "Test{" +
                "id=" + super.getId() +
                '}';
    }
}

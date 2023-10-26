package com.demo.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.List;

@Entity
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
public class Question extends BaseEntity {

    @Column(name = "topic_text", length = Integer.MAX_VALUE)
    @Nationalized
    private String topicText;

    @Lob
    @Column(name = "topic_image", length = 100000)
    private String topicImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private Level level;

    @ManyToOne
    private Chapter chapter;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Answer> answers;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<TestQuestion> testQuestions;

    public enum Level {
        EASY,
        MEDIUM,
        HARD
    }

}

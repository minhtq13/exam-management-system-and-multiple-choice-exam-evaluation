package com.demo.app.model;

import com.demo.app.model.Question.Level;
import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Question.class)
public abstract class Question_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Question, String> topicImage;
	public static volatile SingularAttribute<Question, Chapter> chapter;
	public static volatile SingularAttribute<Question, Level> level;
	public static volatile ListAttribute<Question, Answer> answers;
	public static volatile SingularAttribute<Question, String> topicText;
	public static volatile ListAttribute<Question, TestQuestion> testQuestions;

	public static final String TOPIC_IMAGE = "topicImage";
	public static final String CHAPTER = "chapter";
	public static final String LEVEL = "level";
	public static final String ANSWERS = "answers";
	public static final String TOPIC_TEXT = "topicText";
	public static final String TEST_QUESTIONS = "testQuestions";

}


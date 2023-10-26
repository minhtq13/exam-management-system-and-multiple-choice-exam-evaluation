package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Answer.class)
public abstract class Answer_ extends com.demo.app.model.BaseEntity_ {

	public static volatile ListAttribute<Answer, TestSetQuestionAnswer> testSetQuestionAnswers;
	public static volatile SingularAttribute<Answer, Question> question;
	public static volatile SingularAttribute<Answer, Boolean> isCorrected;
	public static volatile SingularAttribute<Answer, String> content;

	public static final String TEST_SET_QUESTION_ANSWERS = "testSetQuestionAnswers";
	public static final String QUESTION = "question";
	public static final String IS_CORRECTED = "isCorrected";
	public static final String CONTENT = "content";

}


package com.demo.app.model;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(TestSetQuestionAnswer.class)
public abstract class TestSetQuestionAnswer_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<TestSetQuestionAnswer, TestSetQuestion> testSetQuestion;
	public static volatile SingularAttribute<TestSetQuestionAnswer, Answer> answer;
	public static volatile SingularAttribute<TestSetQuestionAnswer, Integer> answerNo;

	public static final String TEST_SET_QUESTION = "testSetQuestion";
	public static final String ANSWER = "answer";
	public static final String ANSWER_NO = "answerNo";

}


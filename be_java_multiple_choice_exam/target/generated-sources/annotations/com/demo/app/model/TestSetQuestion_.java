package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(TestSetQuestion.class)
public abstract class TestSetQuestion_ extends com.demo.app.model.BaseEntity_ {

	public static volatile ListAttribute<TestSetQuestion, TestSetQuestionAnswer> testSetQuestionAnswers;
	public static volatile SingularAttribute<TestSetQuestion, Question> question;
	public static volatile SingularAttribute<TestSetQuestion, Integer> questionNo;
	public static volatile SingularAttribute<TestSetQuestion, TestSet> testSet;
	public static volatile ListAttribute<TestSetQuestion, StudentTestDetail> studentTestDetails;
	public static volatile SingularAttribute<TestSetQuestion, String> binaryAnswer;

	public static final String TEST_SET_QUESTION_ANSWERS = "testSetQuestionAnswers";
	public static final String QUESTION = "question";
	public static final String QUESTION_NO = "questionNo";
	public static final String TEST_SET = "testSet";
	public static final String STUDENT_TEST_DETAILS = "studentTestDetails";
	public static final String BINARY_ANSWER = "binaryAnswer";

}


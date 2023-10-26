package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Test.class)
public abstract class Test_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Test, Integer> duration;
	public static volatile SingularAttribute<Test, Integer> totalPoint;
	public static volatile SingularAttribute<Test, Integer> questionQuantity;
	public static volatile SingularAttribute<Test, Subject> subject;
	public static volatile ListAttribute<Test, TestSet> testSets;
	public static volatile ListAttribute<Test, Question> questions;
	public static volatile ListAttribute<Test, ExamClass> examClasses;
	public static volatile SingularAttribute<Test, LocalTime> testTime;
	public static volatile ListAttribute<Test, TestQuestion> testQuestions;
	public static volatile SingularAttribute<Test, LocalDate> testDay;

	public static final String DURATION = "duration";
	public static final String TOTAL_POINT = "totalPoint";
	public static final String QUESTION_QUANTITY = "questionQuantity";
	public static final String SUBJECT = "subject";
	public static final String TEST_SETS = "testSets";
	public static final String QUESTIONS = "questions";
	public static final String EXAM_CLASSES = "examClasses";
	public static final String TEST_TIME = "testTime";
	public static final String TEST_QUESTIONS = "testQuestions";
	public static final String TEST_DAY = "testDay";

}


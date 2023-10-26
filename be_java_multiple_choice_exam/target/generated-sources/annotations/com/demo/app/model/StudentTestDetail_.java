package com.demo.app.model;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(StudentTestDetail.class)
public abstract class StudentTestDetail_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<StudentTestDetail, TestSetQuestion> testSetQuestion;
	public static volatile SingularAttribute<StudentTestDetail, String> selectedAnswer;
	public static volatile SingularAttribute<StudentTestDetail, StudentTest> studentTest;
	public static volatile SingularAttribute<StudentTestDetail, Boolean> isCorrected;

	public static final String TEST_SET_QUESTION = "testSetQuestion";
	public static final String SELECTED_ANSWER = "selectedAnswer";
	public static final String STUDENT_TEST = "studentTest";
	public static final String IS_CORRECTED = "isCorrected";

}


package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(TestSet.class)
public abstract class TestSet_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<TestSet, String> testNo;
	public static volatile SingularAttribute<TestSet, Test> test;
	public static volatile ListAttribute<TestSet, TestSetQuestion> testSetQuestions;
	public static volatile ListAttribute<TestSet, StudentTest> studentTests;

	public static final String TEST_NO = "testNo";
	public static final String TEST = "test";
	public static final String TEST_SET_QUESTIONS = "testSetQuestions";
	public static final String STUDENT_TESTS = "studentTests";

}


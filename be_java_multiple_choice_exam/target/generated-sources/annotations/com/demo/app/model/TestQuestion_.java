package com.demo.app.model;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(TestQuestion.class)
public abstract class TestQuestion_ {

	public static volatile SingularAttribute<TestQuestion, Question> question;
	public static volatile SingularAttribute<TestQuestion, Test> test;
	public static volatile SingularAttribute<TestQuestion, Double> questionMark;

	public static final String QUESTION = "question";
	public static final String TEST = "test";
	public static final String QUESTION_MARK = "questionMark";

}


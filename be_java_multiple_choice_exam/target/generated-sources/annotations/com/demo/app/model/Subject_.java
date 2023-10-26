package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Subject.class)
public abstract class Subject_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Subject, String> code;
	public static volatile ListAttribute<Subject, Test> tests;
	public static volatile ListAttribute<Subject, Chapter> chapters;
	public static volatile ListAttribute<Subject, Teacher> teachers;
	public static volatile ListAttribute<Subject, ExamClass> examClasses;
	public static volatile SingularAttribute<Subject, String> description;
	public static volatile SingularAttribute<Subject, String> title;
	public static volatile SingularAttribute<Subject, Integer> credit;

	public static final String CODE = "code";
	public static final String TESTS = "tests";
	public static final String CHAPTERS = "chapters";
	public static final String TEACHERS = "teachers";
	public static final String EXAM_CLASSES = "examClasses";
	public static final String DESCRIPTION = "description";
	public static final String TITLE = "title";
	public static final String CREDIT = "credit";

}


package com.demo.app.model;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ExamClass.class)
public abstract class ExamClass_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<ExamClass, String> code;
	public static volatile SingularAttribute<ExamClass, Teacher> teacher;
	public static volatile SingularAttribute<ExamClass, Test> test;
	public static volatile SingularAttribute<ExamClass, Subject> subject;
	public static volatile SetAttribute<ExamClass, Student> students;
	public static volatile SingularAttribute<ExamClass, String> semester;
	public static volatile SingularAttribute<ExamClass, String> roomName;
	public static volatile SingularAttribute<ExamClass, Boolean> enabled;

	public static final String CODE = "code";
	public static final String TEACHER = "teacher";
	public static final String TEST = "test";
	public static final String SUBJECT = "subject";
	public static final String STUDENTS = "students";
	public static final String SEMESTER = "semester";
	public static final String ROOM_NAME = "roomName";
	public static final String ENABLED = "enabled";

}


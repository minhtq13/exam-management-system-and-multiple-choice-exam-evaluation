package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Teacher.class)
public abstract class Teacher_ extends com.demo.app.model.Person_ {

	public static volatile ListAttribute<Teacher, ExamClass> examClasses;
	public static volatile SingularAttribute<Teacher, User> user;

	public static final String EXAM_CLASSES = "examClasses";
	public static final String USER = "user";

}


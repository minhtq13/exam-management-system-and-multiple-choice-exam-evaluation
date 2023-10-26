package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Student.class)
public abstract class Student_ extends com.demo.app.model.Person_ {

	public static volatile ListAttribute<Student, StudentTest> studentTests;
	public static volatile SingularAttribute<Student, Integer> course;

	public static final String STUDENT_TESTS = "studentTests";
	public static final String COURSE = "course";

}


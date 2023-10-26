package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(StudentTest.class)
public abstract class StudentTest_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<StudentTest, Student> student;
	public static volatile SingularAttribute<StudentTest, TestSet> testSet;
	public static volatile SingularAttribute<StudentTest, Double> grade;
	public static volatile SingularAttribute<StudentTest, State> state;
	public static volatile SingularAttribute<StudentTest, Integer> examClassId;
	public static volatile ListAttribute<StudentTest, StudentTestDetail> studentTestDetails;
	public static volatile SingularAttribute<StudentTest, Integer> mark;
	public static volatile SingularAttribute<StudentTest, LocalDate> testDate;

	public static final String STUDENT = "student";
	public static final String TEST_SET = "testSet";
	public static final String GRADE = "grade";
	public static final String STATE = "state";
	public static final String EXAM_CLASS_ID = "examClassId";
	public static final String STUDENT_TEST_DETAILS = "studentTestDetails";
	public static final String MARK = "mark";
	public static final String TEST_DATE = "testDate";

}


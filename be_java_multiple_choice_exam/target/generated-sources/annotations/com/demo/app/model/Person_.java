package com.demo.app.model;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Person.class)
public abstract class Person_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Person, LocalDate> birthday;
	public static volatile SingularAttribute<Person, String> code;
	public static volatile SingularAttribute<Person, String> phoneNumber;
	public static volatile SingularAttribute<Person, Gender> gender;
	public static volatile SingularAttribute<Person, String> fullname;
	public static volatile SingularAttribute<Person, User> user;

	public static final String BIRTHDAY = "birthday";
	public static final String CODE = "code";
	public static final String PHONE_NUMBER = "phoneNumber";
	public static final String GENDER = "gender";
	public static final String FULLNAME = "fullname";
	public static final String USER = "user";

}


package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, Teacher> teacher;
	public static volatile SingularAttribute<User, Student> student;
	public static volatile ListAttribute<User, Role> roles;
	public static volatile ListAttribute<User, Token> tokens;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SingularAttribute<User, String> username;

	public static final String PASSWORD = "password";
	public static final String TEACHER = "teacher";
	public static final String STUDENT = "student";
	public static final String ROLES = "roles";
	public static final String TOKENS = "tokens";
	public static final String EMAIL = "email";
	public static final String USERNAME = "username";

}


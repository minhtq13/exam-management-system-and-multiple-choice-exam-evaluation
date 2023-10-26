package com.demo.app.model;

import jakarta.persistence.metamodel.ListAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Chapter.class)
public abstract class Chapter_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Chapter, Subject> subject;
	public static volatile ListAttribute<Chapter, Question> questions;
	public static volatile SingularAttribute<Chapter, String> title;
	public static volatile SingularAttribute<Chapter, Integer> order;

	public static final String SUBJECT = "subject";
	public static final String QUESTIONS = "questions";
	public static final String TITLE = "title";
	public static final String ORDER = "order";

}


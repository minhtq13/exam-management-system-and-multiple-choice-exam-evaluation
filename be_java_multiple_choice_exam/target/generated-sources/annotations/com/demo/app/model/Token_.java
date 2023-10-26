package com.demo.app.model;

import com.demo.app.model.Token.TokenType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Token.class)
public abstract class Token_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Token, Boolean> expired;
	public static volatile SingularAttribute<Token, TokenType> type;
	public static volatile SingularAttribute<Token, Boolean> revoked;
	public static volatile SingularAttribute<Token, User> user;
	public static volatile SingularAttribute<Token, String> token;

	public static final String EXPIRED = "expired";
	public static final String TYPE = "type";
	public static final String REVOKED = "revoked";
	public static final String USER = "user";
	public static final String TOKEN = "token";

}


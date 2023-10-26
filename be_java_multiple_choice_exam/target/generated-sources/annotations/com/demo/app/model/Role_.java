package com.demo.app.model;

import com.demo.app.model.Role.RoleType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Role.class)
public abstract class Role_ extends com.demo.app.model.BaseEntity_ {

	public static volatile SingularAttribute<Role, RoleType> roleName;

	public static final String ROLE_NAME = "roleName";

}


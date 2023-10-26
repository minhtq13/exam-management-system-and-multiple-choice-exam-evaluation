package com.elearning.elearning_support.security.constants;

import lombok.Data;


@Data
public class SecurityConstants {

    public static final String BEARER_AUTH_SCHEME = "Bearer";

    public static final String API_KEY = "ELEARNING_SUPPORT";

    public static final String AUTH_HEADER = "Authorization";

    public static final String[] LIST_PERMIT_ALL_API = {"/auth/login", "/resources/upload/files/**"};

}

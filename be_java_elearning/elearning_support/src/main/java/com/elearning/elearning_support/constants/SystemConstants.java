package com.elearning.elearning_support.constants;

import lombok.Data;

@Data
public class SystemConstants {

    public static final String BASE_PATH = System.getProperty("user.dir");

    public static final String RESOURCE_PATH = BASE_PATH + "/src/main/resources/";

}

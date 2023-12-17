package com.elearning.elearning_support.constants;

import lombok.Data;

@Data
public class SystemConstants {

    public static final String BASE_PATH = System.getProperty("user.dir");

    public static final String USER_DIR = System.getProperty("user.home");

    public static final String RESOURCE_PATH = BASE_PATH + "/src/main/resources/";

    public static final String WINDOWS_SHARED_DIR = USER_DIR + "/AppData/Local/ELearningSupport";

    public static final String LINUX_SHARED_DIR = USER_DIR + "/usr/local/app/ELearningSupport";

    public static final String SHARED_DIR_SERVER_PATH = "/public/shared";

    public static final boolean IS_WINDOWS = System.getProperty("os.name").toLowerCase().contains("windows");

}

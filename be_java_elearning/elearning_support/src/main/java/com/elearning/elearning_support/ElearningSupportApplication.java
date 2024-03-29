package com.elearning.elearning_support;

import java.io.File;
import java.util.Calendar;
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import com.elearning.elearning_support.utils.DateUtils;
import com.elearning.elearning_support.utils.file.FileUtils;
import lombok.extern.slf4j.Slf4j;

@EnableAsync
@SpringBootApplication
@Slf4j
public class ElearningSupportApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElearningSupportApplication.class, args);
    }

    @PostConstruct
    public void init() {
        log.info("========= INITIALIZED TIMEZONE {} =========", Calendar.getInstance().getTimeZone().getID());

        // init shared app folder
        // data folder
        File sharedDataFolder = new File(FileUtils.getSharedAppDirectoryDataPath());
        if (!sharedDataFolder.exists()) {
            sharedDataFolder.mkdirs();
        }
        // source folder
        File sharedSourceFolder = new File(FileUtils.getSharedAppDirectoryPath() + "/source");
        if (!sharedSourceFolder.exists()) {
            sharedSourceFolder.mkdirs();
        }
        // logs folder
        File sharedLogsFolder = new File(FileUtils.getSharedAppDirectoryPath() + "/logs");
        if (!sharedLogsFolder.exists()) {
            sharedLogsFolder.mkdirs();
        }
        log.info("========= INITIALIZED SHARED DATA, SOURCE AND LOGS FOLDER =========");
    }

}

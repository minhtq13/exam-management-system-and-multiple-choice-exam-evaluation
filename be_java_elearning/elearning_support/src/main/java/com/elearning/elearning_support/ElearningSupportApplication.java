package com.elearning.elearning_support;

import java.io.File;
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
        // set time zone default
        TimeZone.setDefault(TimeZone.getTimeZone(DateUtils.TIME_ZONE));
        log.info("========= INITIALIZED TIMEZONE {} =========", DateUtils.TIME_ZONE);

        // init shared app folder
        File sharedDataFolder = new File(FileUtils.getSharedAppDirectoryDataPath());
        File sharedSourceFolder = new File(FileUtils.getSharedAppDirectorySourcePath());
        if (!sharedDataFolder.exists()) {
            sharedDataFolder.mkdirs();
        }
        if (!sharedSourceFolder.exists()) {
            sharedSourceFolder.mkdirs();
        }
        log.info("========= INITIALIZED SHARED DATA AND SOURCE FOLDER =========");
    }

}

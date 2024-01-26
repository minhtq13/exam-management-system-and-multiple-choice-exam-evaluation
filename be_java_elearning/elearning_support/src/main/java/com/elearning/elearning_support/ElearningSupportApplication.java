package com.elearning.elearning_support;

import java.io.File;
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
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
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        // init shared app folder
        File sharedFolder = new File(FileUtils.getSharedAppDirectoryPath());
        if (!sharedFolder.exists()) {
            sharedFolder.mkdirs();
        }
        log.info("========= INITIALIZED SHARED FOLDER =========");
    }

}

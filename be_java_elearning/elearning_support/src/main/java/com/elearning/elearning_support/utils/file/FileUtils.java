package com.elearning.elearning_support.utils.file;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.utils.DateUtils;

public class FileUtils {

    public static File covertMultipartToFile(String tempPath, MultipartFile multipartFile) {
        SimpleDateFormat formatter = new SimpleDateFormat(DateUtils.FORMAT_DATE_YYYY_MMDD_HHMMSS);
        try {
            if (Objects.isNull(multipartFile) || Objects.isNull(multipartFile.getOriginalFilename())) {
                return null;
            }
            File covertedFile = new File(tempPath + formatter.format(new Date()) + "_" + multipartFile.getOriginalFilename().replace(" ", "_"));
            FileOutputStream fos = new FileOutputStream(covertedFile);
            fos.write(multipartFile.getBytes());
            fos.close();
            return covertedFile;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * Get extension index = last index of '.'
     */
    public static String getFileExt(File file) {
        if (file.exists() && file.isFile()) {
            Integer extIndex = file.getName().lastIndexOf('.');
            return file.getName().substring(extIndex + 1);
        }
        return "";
    }

    public static String getFileBodyName(File file) {
        if (file.exists() && file.isFile()) {
            int extIndex = file.getName().lastIndexOf('.');
            return file.getName().substring(extIndex - 1);
        }
        return "";
    }

}

package com.elearning.elearning_support.utils.file;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.constants.FileConstants;
import com.elearning.elearning_support.constants.FileConstants.Extension;
import com.elearning.elearning_support.constants.FileConstants.Extension.Video;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.FileAttach;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.exceptions.FileUploadException;
import com.elearning.elearning_support.utils.DateUtils;

public class FileUtils {

    private final String IMAGES_RESOURCE_DIR = "/resources/upload/files/images/";

    public static final String IMAGES_STORED_LOCATION = "upload/files/images/";

    public static final String DOCUMENTS_RESOURCE_DIR = "/resources/upload/files/docs/";

    public static final String DOCUMENTS_STORED_LOCATION = "upload/files/docs/";

    public static final Integer MAX_UPDATE_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    public static final Integer MAX_FILENAME_LENGTH = 256; // 256 characters including the file's ext

    public static final Integer AVATAR_FILE_TYPE = 0;

    public static final Integer IMAGES_FILE_TYPE = 1;

    public static final Integer DOCUMENT_FILE_TYPE = 2;

    public static final Integer VIDEOS_FILE_TYPE = 3;

    public static File covertMultipartToFile(String tempPath, MultipartFile multipartFile) {
        SimpleDateFormat formatter = new SimpleDateFormat(DateUtils.FORMAT_DATE_YYYY_MMDD_HHMMSS);
        try {
            if (Objects.isNull(multipartFile) || Objects.isNull(multipartFile.getOriginalFilename())) {
                return null;
            }
            File convertedFile = new File(tempPath + formatter.format(new Date()) + "_" + multipartFile.getOriginalFilename().replace(" ", "_"));
            FileOutputStream fos = new FileOutputStream(convertedFile);
            fos.write(multipartFile.getBytes());
            fos.close();
            return convertedFile;
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
            int extIndex = file.getName().lastIndexOf('.');
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

    public static Integer getFileType(String fileExtension) {
        int type;
        switch (fileExtension) {
            case FileConstants.Extension.Image.GIF:
            case Extension.Image.JPG:
            case Extension.Image.JPEG:
            case Extension.Image.PNG:
            case Extension.Image.WEBP:
            case Extension.Image.TIFF:
            case Extension.Image.JFIF:
                type = IMAGES_FILE_TYPE;
                break;
            case Video.MKV:
            case Video.FLV:
            case Video.AVI:
            case Video.MP4:
            case Video.MOV:
            case Video.WMV:
            case Video.VOB:
                type = VIDEOS_FILE_TYPE;
                break;
            default:
                type = -1;
                break;
        }
        return type;
    }

    /**
     * Validate fileSize and fileExt
     */
    public static void validateUploadFile(MultipartFile file, List<String> targetExtensions) {
        // Validate file null
        if (Objects.isNull(file)) {
            throw new FileUploadException(FileAttach.UPLOAD_ERROR_CODE, Resources.FILE_ATTACHED, MessageConst.UPLOAD_FAILED);
        }

        // Validate fileSize
        if (file.getSize() > MAX_UPDATE_FILE_SIZE) {
            throw new FileUploadException(FileAttach.FILE_EXCESS_SIZE_ERROR_CODE, Resources.FILE_ATTACHED, MessageConst.UPLOAD_FAILED);
        }

        // Validate fileName length
        if (Objects.requireNonNull(file.getOriginalFilename()).length() > MAX_FILENAME_LENGTH) {
            throw new FileUploadException(FileAttach.FILE_EXCESS_FILENAME_LENGTH_ERROR_CODE, Resources.FILE_ATTACHED,
                MessageConst.UPLOAD_FAILED);
        }

        // Validate fileExt
        if (!targetExtensions.contains(FilenameUtils.getExtension(file.getOriginalFilename()))) {
            throw new FileUploadException(FileAttach.FILE_INVALID_EXTENSION_ERROR_CODE, Resources.FILE_ATTACHED, MessageConst.UPLOAD_FAILED);
        }
    }

    public static class Excel {

        public static final String[] EXTENSIONS = new String[] {
          "xlsx", "xls"
        };
        public static final String[] CONTENT_TYPES = new String[] {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"
        };
    }

    public  static  class Word {
        public static final String[] EXTENSIONS = new String[] {
            "docx", "doc"
        };
        public static final String[] CONTENT_TYPES = new String[] {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"
        };
    }



}

package com.elearning.elearning_support.services.fileAttach.impl;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.elearning.elearning_support.constants.SystemConstants;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst;
import com.elearning.elearning_support.constants.message.messageConst.MessageConst.Resources;
import com.elearning.elearning_support.dtos.fileAttach.FileUploadResDTO;
import com.elearning.elearning_support.entities.file_attach.FileAttach;
import com.elearning.elearning_support.enums.file_attach.FileStoredTypeEnum;
import com.elearning.elearning_support.enums.file_attach.FileTypeEnum;
import com.elearning.elearning_support.exceptions.exceptionFactory.ExceptionFactory;
import com.elearning.elearning_support.repositories.fileAttach.FileAttachRepository;
import com.elearning.elearning_support.services.fileAttach.FileAttachService;
import com.elearning.elearning_support.utils.auth.AuthUtils;
import com.elearning.elearning_support.utils.file.FileUtils;

@Service
public class FileAttachServiceImpl implements FileAttachService {

    private final Cloudinary cloudinary;

    private final FileAttachRepository fileAttachRepository;

    private final ExceptionFactory exceptionFactory;


    public FileAttachServiceImpl(Cloudinary cloudinary, FileAttachRepository fileAttachRepository, ExceptionFactory exceptionFactory) {
        this.cloudinary = cloudinary;
        this.fileAttachRepository = fileAttachRepository;
        this.exceptionFactory = exceptionFactory;
    }


    @Override
    public FileUploadResDTO uploadMPImageToCloudinary(MultipartFile multipartFile, FileTypeEnum fileType) {
        try {
            File uploadFile = FileUtils.covertMultipartToFile(SystemConstants.RESOURCE_PATH + FileUtils.IMAGES_STORED_LOCATION, multipartFile);
            // Map option upload file cloudinary
            Map<String, Object> mapOptions = new HashMap<>();
            mapOptions.put("use_filename", true);
            mapOptions.put("resource_type", "image");
            Map<String, Object> uploadResponse = cloudinary.uploader().upload(uploadFile, mapOptions);
            String location = (String)uploadResponse.get("secure_url");
            if (Objects.isNull(uploadFile) || Objects.isNull(location)) {
                throw exceptionFactory.fileUploadException(MessageConst.FileAttach.UPLOAD_ERROR_CODE, Resources.FILE_ATTACHED, MessageConst.UPLOAD_FAILED);
            }

            // Creat file attach in db
            FileAttach fileAttach = FileAttach.builder()
                .extension(FileUtils.getFileExt(uploadFile))
                .type(fileType.getType())
                .name(uploadFile.getName())
                .externalLink(location)
                .storedType(FileStoredTypeEnum.EXTERNAL_SERVER.getType())
                .size(multipartFile.getSize())
                .createdAt(LocalDateTime.now())
                .createdBy(AuthUtils.getCurrentUserId())
                .build();
            fileAttach = fileAttachRepository.save(fileAttach);
            // Delete file after upload cloudinary
            boolean isDeleted = uploadFile.delete();
            return new FileUploadResDTO(fileAttach.getId(), fileAttach.getName(), fileAttach.getExternalLink(), fileAttach.getType(), fileAttach);
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @Override
    public FileUploadResDTO uploadFileToCloudinary(File file, FileTypeEnum fileType) {
        try {
            if (Objects.isNull(file)) {
                return new FileUploadResDTO();
            }
            // Map option upload file cloudinary
            Map<String, Object> mapOptions = new HashMap<>();
            mapOptions.put("use_filename", true);
            mapOptions.put("resource_type", "auto");
            Map<String, Object> uploadResponse = cloudinary.uploader().upload(file, mapOptions);
            String location = (String) uploadResponse.get("secure_url");
            if (Objects.isNull(location)) {
                throw exceptionFactory.fileUploadException(MessageConst.FileAttach.UPLOAD_ERROR_CODE, Resources.FILE_ATTACHED,
                    MessageConst.UPLOAD_FAILED);
            }

            // Create file attach to store in DB
            FileAttach fileAttach = FileAttach.builder()
                .extension(FileUtils.getFileExt(file))
                .type(fileType.getType())
                .name(file.getName())
                .externalLink(location)
                .storedType(FileStoredTypeEnum.EXTERNAL_SERVER.getType())
                .size(file.getTotalSpace())
                .createdAt(LocalDateTime.now())
                .createdBy(AuthUtils.getCurrentUserId())
                .build();
//            fileAttach = fileAttachRepository.save(fileAttach);
            // Delete file after upload cloudinary (temp not delete file after uploading)
//            boolean isDeleted = file.delete();
            return new FileUploadResDTO(fileAttach.getId(), fileAttach.getName(), fileAttach.getExternalLink(), fileAttach.getType(),
                fileAttach);
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @Override
    public FileUploadResDTO uploadDocument(MultipartFile multipartFile, FileTypeEnum fileType) {
        // generate file name
        File uploadFile = FileUtils.covertMultipartToFile(SystemConstants.RESOURCE_PATH + FileUtils.DOCUMENTS_STORED_LOCATION, multipartFile);
        if (Objects.isNull(uploadFile)) {
            throw exceptionFactory.fileUploadException(MessageConst.FileAttach.UPLOAD_ERROR_CODE, Resources.FILE_ATTACHED, MessageConst.UPLOAD_FAILED);
        }
        String location = FileUtils.DOCUMENTS_RESOURCE_DIR + uploadFile.getName();

        // create file attach
        FileAttach fileAttach = FileAttach.builder()
            .extension(FileUtils.getFileExt(uploadFile))
            .type(fileType.getType())
            .name(uploadFile.getName())
            .filePath(location)
            .size(multipartFile.getSize())
            .storedType(FileStoredTypeEnum.INTERNAL_SERVER.getType())
            .createdAt(LocalDateTime.now())
            .createdBy(AuthUtils.getCurrentUserId())
            .build();
        fileAttach = fileAttachRepository.save(fileAttach);
        return new FileUploadResDTO(fileAttach.getId(), fileAttach.getName(), fileAttach.getFilePath(), fileAttach.getType(), fileAttach);
    }


}

package com.elearning.elearning_support.services.fileAttach;

import java.io.File;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.elearning_support.dtos.fileAttach.FileUploadResDTO;
import com.elearning.elearning_support.entities.file_attach.FileAttach;
import com.elearning.elearning_support.enums.file_attach.FileTypeEnum;

@Service
public interface FileAttachService {

    /**
     * Upload image file
     */
    FileUploadResDTO uploadMPImageToCloudinary(MultipartFile multipartFile, FileTypeEnum fileType);

    /**
     * Upload file to cloudinary
     */
    FileUploadResDTO uploadFileToCloudinary(File file, FileTypeEnum fileType);

    /**
     * Upload document file
     */
    FileUploadResDTO uploadDocument(MultipartFile multipartFile, FileTypeEnum fileType);



}

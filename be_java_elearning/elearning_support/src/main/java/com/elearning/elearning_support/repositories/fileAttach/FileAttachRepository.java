package com.elearning.elearning_support.repositories.fileAttach;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.file_attach.FileAttach;

@Repository
public interface FileAttachRepository extends JpaRepository<FileAttach, Long> {

}

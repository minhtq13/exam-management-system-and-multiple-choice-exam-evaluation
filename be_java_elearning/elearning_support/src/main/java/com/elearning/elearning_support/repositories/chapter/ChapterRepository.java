package com.elearning.elearning_support.repositories.chapter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.chapter.Chapter;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

}

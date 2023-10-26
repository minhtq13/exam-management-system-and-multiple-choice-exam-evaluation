package com.demo.app.repository;

import com.demo.app.model.Chapter;
import com.demo.app.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query("""
            select q
            from Subject s
                inner join Chapter c on s.id = c.subject.id
                inner join Question q on c.id = q.chapter.id
            where s.code = :code and c.id in :chapter_ids and q.enabled = true
            order by rand()
            """)
    Page<Question> findQuestionBySubjectChapterOrder(@Param("code") String code,
                                                     @Param("chapter_ids") List<Integer> chapterIds,
                                                     Pageable pageable);

    int countByEnabledIsTrueAndChapterIn(List<Chapter> chapters);

    List<Question> findByEnabledIsTrueAndChapterIn(List<Chapter> chapters);

    Boolean existsByIdAndEnabledIsTrue(Integer id);

}

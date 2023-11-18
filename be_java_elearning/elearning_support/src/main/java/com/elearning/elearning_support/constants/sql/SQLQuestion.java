package com.elearning.elearning_support.constants.sql;

public class SQLQuestion {

    public static final String GET_LIST_QUESTION = 
        "SELECT \n" +
            "    question.id AS id, \n" +
            "    question.code AS code, \n" +
            "    question.content AS content, \n" +
            "    question.level AS level, \n" +
            "    {h-schema}get_list_file_json_by_ids_id(('{' || question.image_id || '}')::::int8[]) AS lstImageJson, \n" +
            "    {h-schema}get_list_answer_json_by_question_id(question.id) AS lstAnswerJson \n" +
            "FROM {h-schema}question \n" +
            "    LEFT JOIN {h-schema}chapter ON question.chapter_id = chapter.id \n" +
            "    LEFT JOIN {h-schema}subject ON chapter.subject_id = subject.id \n" +
            "WHERE \n" +
            "    question.is_enabled = true AND \n" +
            "    question.deleted_flag = 1 AND \n" +
            "    (-1 = :questionLevel OR question.level = :questionLevel) AND \n" +
            "    (-1 = :subjectId OR subject.id = :subjectId) AND \n" +
            "    ('' = :subjectCode OR subject.code = :subjectCode) AND \n" +
            "    (-1 IN (:chapterIds) OR chapter.id IN (:chapterIds)) AND \n" +
            "    ('' = :chapterCode OR chapter.code = :chapterCode) ";

    public static final String GET_LIST_QUESTION_ID_BY_CHAPTER_ID_IN =
        "SELECT id FROM {h-schema}question WHERE chapter_id IN (:lstChapterId) AND deleted_flag = 1";

    public static final String GET_LIST_QUESTION_IN_TEST =
        "SELECT \n" +
            "   testQuest.question_id AS id, \n" +
            "   question.level AS level, \n" +
            "   '{' || string_agg(CAST(answer.id AS TEXT), ',') || '}' AS lstAnswerId \n" +
            "FROM {h-schema}test_question AS testQuest \n" +
            "   JOIN {h-schema}question ON testQuest.question_id = question.id \n" +
            "   LEFT JOIN {h-schema} answer ON testQuest.question_id = answer.question_id \n" +
            "WHERE testQuest.test_id = :testId AND question.is_enabled = true \n" +
            "GROUP BY testQuest.question_id, question.level";

}

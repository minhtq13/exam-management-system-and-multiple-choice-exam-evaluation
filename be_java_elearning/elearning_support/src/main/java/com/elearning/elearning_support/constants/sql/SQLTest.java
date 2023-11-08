package com.elearning.elearning_support.constants.sql;

public class SQLTest {

    public static final String GET_LIST_TEST =
        "SELECT \n" +
            "    test.id AS id, \n" +
            "    test.name AS name, \n" +
            "    test.duration AS duration, \n" +
            "    test.question_quantity AS questionQuantity, \n" +
            "    test.created_at AS createdAt, \n" +
            "    test.modified_at AS modifiedAt, \n" +
            "    test.start_time AS startTime, \n" +
            "    test.end_time AS endTime, \n" +
            "    subject.title AS subjectName, \n" +
            "    subject.code AS subjectCode \n" +
            "FROM {h-schema}test \n" +
            "    LEFT JOIN {h-schema}subject ON test.subject_id = subject.id \n" +
            "WHERE \n" +
            "    test.is_enabled = true AND \n" +
            "    test.deleted_flag = 1 AND \n" +
            "    (-1 = :subjectId OR subject.id = :subjectId) AND \n" +
            "    ('ALL' = :subjectCode OR subject.code = :subjectCode) AND \n" +
            "    (:startTime = DATE('1970-01-01') OR test.start_time >= :startTime) AND \n" +
            "    (:endTime = DATE('1970-01-01') OR test.end_time <= :endTime) ";

    public static final String SWITCH_TEST_STATUS =
        "UPDATE {h-schema}test SET is_enabled = :isEnabled WHERE id = :testId";


    public static final String GET_TEST_SET_DETAILS =
        "SELECT \n" +
            "    testSet.id AS testSetId, \n" +
            "    testSet.test_id AS testId, \n" +
            "    test.name AS testName, \n" +
            "    test.question_quantity AS questionQuantity, \n" +
            "    testSet.test_no AS testNo, \n" +
            "    testSet.code AS testSetCode, \n" +
            "    test.duration AS duration, \n" +
            "    semester.code AS semester, \n" +
            "    subject.title AS subjectTitle, \n" +
            "    subject.code AS subjectCode, \n" +
            "    testSet.created_at AS createdAt, \n" +
            "    testSet.modified_at AS modifiedAt \n" +
            "FROM {h-schema}test_set AS testSet \n" +
            "    JOIN {h-schema}test ON testSet.test_id = test.id \n" +
            "    LEFT JOIN {h-schema}semester ON test.semester_id = semester.id \n" +
            "    LEFT JOIN {h-schema}subject ON test.subject_id = subject.id \n" +
            "WHERE \n" +
            "    testSet.is_enabled = true AND \n" +
            "    testSet.test_id = :testId AND \n" +
            "    testSet.code = :code";

    public static final String GET_LIST_TEST_SET_QUESTION =
        "SELECT \n" +
            "    testSetQuest.question_id AS id, \n" +
            "    question.content AS content, \n" +
            "    question.level AS level, \n" +
            "    testSetQuest.question_no AS questionNo, \n" +
            "    COALESCE({h-schema}get_list_file_json_by_ids_id(('{' || question.image_id || '}')::::int8[]), '[]') AS lstImageJson, \n" +
            "    COALESCE({h-schema}get_list_test_question_answer_json(testSetQuest.lst_answer_json), '[]') AS lstAnswerJson \n" +
            "FROM {h-schema}test_set_question testSetQuest \n" +
            "     JOIN {h-schema}question ON testSetQuest.question_id = question.id \n" +
            "WHERE testSetQuest.test_set_id = :testSetId";

}

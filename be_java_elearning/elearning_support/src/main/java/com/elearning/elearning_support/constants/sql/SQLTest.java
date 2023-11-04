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

}

package com.elearning.elearning_support.constants.sql;

public class SQLTestSet {

    public static final String GET_LIST_TEST_QUESTION_CORRECT_ANSWER =
        "SELECT \n" +
            "    testSetQuest.id AS id, \n" +
            "    testSetQuest.test_set_id AS testSetId, \n" +
            "    testSetQuest.question_id AS questionId, \n" +
            "    testSetQuest.question_no AS questionNo, \n" +
            "    COALESCE(testSetQuest.question_mark, 0) AS questionMark, \n" +
            "    {h-schema}get_correct_in_lst_answer_json(testSetQuest.lst_answer_json) AS correctAnswerNo \n" +
            "FROM {h-schema}test_set_question AS testSetQuest \n" +
            "WHERE testSetQuest.test_set_id = :testSetId ";

    public static final String GET_LIST_TEST_SET_GENERAL_SCORING_DATA =
        "SELECT  \n" +
            "    testSet.id AS testSetId, \n" +
            "    testSet.code AS testSetCode, \n" +
            "    exClass.id AS examClassId, \n" +
            "    exClass.code AS examClassCode, \n" +
            "    testSet.question_mark AS questionMark \n" +
            "FROM {h-schema}test_set AS testSet \n" +
            "    JOIN {h-schema}test ON testSet.test_id = test.id \n" +
            "    JOIN {h-schema}exam_class AS exClass ON exClass.test_id = test.id \n" +
            "WHERE exClass.code IN (:examClassCodes) AND testSet.code IN (:testCodes)";

}

package com.elearning.elearning_support.constants.sql;

public class SQLStudentTestSet {

    public static final String GET_LIST_STUDENT_TEST_SET_RESULT =
        "WITH studentTestSetCTE AS ( \n" +
            "    SELECT \n" +
            "        stdTestSet.id AS id, \n" +
            "        stdTestSet.student_id AS student_id, \n" +
            "        stdTestSet.test_set_id AS test_set_id, \n" +
            "        stdTestSet.marked AS num_marked_answers, \n" +
            "        stdTestSet.handed_test_file as handed_img_id, \n" +
            "        COUNT(testSetQuest.id) AS num_test_set_questions, \n" +
            "        COUNT(stdTestSetDetail.id) FILTER ( WHERE stdTestSetDetail.is_corrected is TRUE) AS num_correct_answers, \n" +
            "        COALESCE(SUM(testSetQuest.question_mark) FILTER ( WHERE stdTestSetDetail.is_corrected is TRUE), 0) AS total_points \n" +
            "    FROM {h-schema}student_test_set AS stdTestSet \n" +
            "        LEFT JOIN {h-schema}student_test_set_detail AS stdTestSetDetail ON stdTestSet.id = stdTestSetDetail.student_test_set_id \n" +
            "        LEFT JOIN {h-schema}test_set_question AS testSetQuest ON testSetQuest.id = stdTestSetDetail.test_set_question_id \n" +
            "    WHERE \n" +
            "        stdTestSet.student_id IN (:studentIds) AND \n" +
            "        stdTestSet.test_set_id IN (:testSetIds) \n" +
            "    GROUP BY stdTestSet.id, stdTestSet.student_id, stdTestSet.test_set_id \n" +
            ") \n" +
        "SELECT \n" +
            "    studentTestSetCTE.id AS id, \n" +
            "    studentTestSetCTE.student_id AS studentId, \n" +
            "    CONCAT_WS(' ', users.last_name, users.first_name) AS studentName, \n" +
            "    users.code AS studentCode, \n" +
            "    studentTestSetCTE.test_set_id AS testSetId, \n" +
            "    testSet.code AS testSetCode, \n" +
            "    studentTestSetCTE.num_test_set_questions numTestSetQuestions, \n" +
            "    studentTestSetCTE.num_marked_answers AS numMarkedAnswers, \n" +
            "    studentTestSetCTE.num_correct_answers AS numCorrectAnswers, \n" +
            "    studentTestSetCTE.total_points AS totalPoints, \n" +
            "    COALESCE(handledImg.file_path, handledImg.external_link) AS handledSheetImg \n" +
            "FROM studentTestSetCTE \n" +
            "    LEFT JOIN {h-schema}users ON users.id = studentTestSetCTE.student_id \n" +
            "    LEFT JOIN {h-schema}test_set AS testSet ON studentTestSetCTE.test_set_id = testSet.id \n" +
            "    LEFT JOIN {h-schema}file_attach AS handledImg ON handledImg.id = studentTestSetCTE.handed_img_id AND handledImg.type = 1 \n" +
            "ORDER BY studentName ASC";

}

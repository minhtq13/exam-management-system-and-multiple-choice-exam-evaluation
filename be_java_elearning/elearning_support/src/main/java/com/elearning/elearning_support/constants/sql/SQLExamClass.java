package com.elearning.elearning_support.constants.sql;

public class SQLExamClass {

    public static final String GET_COUNTER_EXAM_CLASS_PARTICIPANT =
        "SELECT \n" +
            "    exam_class_id AS examClassId, \n" +
            "    COUNT(user_id) FILTER (WHERE role_type = 1) AS numSupervisors, \n" +
            "    COUNT(user_id) FILTER (WHERE role_type = 0) AS numStudents \n" +
            "FROM {h-schema}user_exam_class \n" +
            "GROUP BY exam_class_id \n";

    public static final String GET_LIST_EXAM_CLASS =
        "WITH examClassParticipantCTE AS ( " + GET_COUNTER_EXAM_CLASS_PARTICIPANT + " ) \n" +
            "SELECT \n" +
            "    exClass.id AS id, \n" +
            "    exClass.code AS code, \n" +
            "    exClass.room_name AS roomName, \n" +
            "    exClass.examine_time AS examineTime, \n" +
            "    test.id AS testId, \n" +
            "    test.name AS testName, \n" +
            "    test.duration AS duration, \n" +
            "    semester.code AS semester, \n" +
            "    subject.title AS subjectTitle, \n" +
            "    examClassParticipantCTE.numStudents AS numberOfStudents, \n" +
            "    examClassParticipantCTE.numSupervisors AS numberOfSupervisors \n" +
            "FROM {h-schema}exam_class AS exClass \n" +
            "    JOIN {h-schema}test ON exClass.test_id = test.id \n" +
            "    LEFT JOIN {h-schema}subject ON test.subject_id = subject.id \n" +
            "    LEFT JOIN {h-schema}semester ON test.semester_id = semester.id \n" +
            "    LEFT JOIN examClassParticipantCTE ON exClass.id = examClassParticipantCTE.examClassId \n" +
            "WHERE \n" +
            "    exClass.is_enabled = true AND \n" +
            "    exClass.deleted_flag = 1 AND \n" +
            "    ('' = :code OR exClass.code ILIKE ('%' || :code || '%')) AND \n" +
            "    (-1 = :semesterId OR exClass.semester_id = :semesterId) AND \n" +
            "    (-1 = :testId OR exClass.test_id = :testId) AND \n" +
            "    (-1 = :subjectId OR subject.id = :subjectId)";

    public static final String GET_DETAILS_EXAM_CLASS =
        "WITH examClassParticipantCTE AS ( " + GET_COUNTER_EXAM_CLASS_PARTICIPANT + " ) \n" +
            "SELECT \n" +
            "    exClass.id AS id, \n" +
            "    exClass.code AS code, \n" +
            "    exClass.room_name AS roomName, \n" +
            "    exClass.examine_time AS examineTime, \n" +
            "    test.id AS testId, \n" +
            "    test.name AS testName, \n" +
            "    semester.id AS semesterId, \n" +
            "    semester.code AS semester, \n" +
            "    subject.id AS subjectId, \n" +
            "    subject.title AS subjectTitle, \n" +
            "    examClassParticipantCTE.numStudents AS numberOfStudents, \n" +
            "    examClassParticipantCTE.numSupervisors AS numberOfSupervisors, \n" +
            "    COALESCE(exClass.modified_at, exClass.created_at) AS lastModifiedAt \n" +
            "FROM {h-schema}exam_class AS exClass \n" +
            "    JOIN {h-schema}test ON exClass.test_id = test.id \n" +
            "    LEFT JOIN {h-schema}subject ON test.subject_id = subject.id \n" +
            "    LEFT JOIN {h-schema}semester ON test.semester_id = semester.id \n" +
            "    LEFT JOIN examClassParticipantCTE ON exClass.id = examClassParticipantCTE.examClassId \n" +
            "WHERE \n" +
            "    exClass.is_enabled = true AND \n" +
            "    exClass.deleted_flag = 1 AND \n" +
            "    exClass.id = :id ";

    public static final String GET_LIST_EXAM_CLASS_PARTICIPANT =
        "SELECT \n" +
            "   participant.id AS id, \n" +
            "   CONCAT_WS(' ', participant.last_name, participant.first_name) AS name, \n" +
            "   participant.code AS code, \n" +
            "   userExClass.role_type AS roleType, \n" +
            "   CASE \n" +
            "       WHEN userExClass.role_type = 0 THEN 'Thí sinh' \n" +
            "       WHEN userExClass.role_type = 1 THEN 'Giám thị' \n" +
            "       ELSE '' \n" +
            "   END AS roleName, \n" +
            "   exClass.id AS examClassId, \n" +
            "   exClass.code AS examClassCode \n" +
            "FROM {h-schema}user_exam_class AS userExClass \n" +
            "    JOIN {h-schema}users AS participant ON userExClass.user_id = participant.id \n" +
            "    JOIN {h-schema}exam_class AS exClass ON exClass.id = userExClass.exam_class_id \n" +
            "WHERE userExClass.exam_class_id = :examClassId AND userExClass.role_type = :roleType ";

    public static final String DELETE_EXAM_CLASS_PARTICIPANT_BY_ID =
        "DELETE FROM {h-schema}user_exam_class WHERE exam_class_id = :examClassId";



}

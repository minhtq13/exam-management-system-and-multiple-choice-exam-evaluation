package com.elearning.elearning_support.constants.sql;

public class SQLSubject {

    public static final String GET_LIST_SUBJECT =
        "SELECT \n" +
            "    subject.id AS id, \n" +
            "    subject.code AS code, \n" +
            "    subject.title AS title, \n" +
            "    subject.credit AS credit, \n" +
            "    department.name AS departmentName \n" +
            "FROM {h-schema}subject \n" +
            "    LEFT JOIN {h-schema}department ON subject.department_id = department.id \n" +
            "WHERE \n" +
            "    subject.is_enabled = true AND \n" +
            "    subject.deleted_flag = 1 AND \n" +
            "    ('' = :subjectTitle OR subject.title ILIKE ('%' || :subjectTitle || '%')) AND \n" +
            "    ('' = :subjectCode OR subject.code ILIKE ('%' || :subjectCode || '%')) AND \n" +
            "    ('' = :departmentName OR department.name ILIKE ('%' || :departmentName || '%')) AND \n" +
            "    (-1 = :departmentId OR department.id = :departmentId)";


    public static final String GET_DETAIL_SUBJECT =
        "SELECT \n" +
            "    subject.id AS id, \n" +
            "    subject.code AS code, \n" +
            "    subject.title AS title, \n" +
            "    subject.description AS description, \n" +
            "    subject.credit AS credit, \n" +
            "    department.id AS departmentId, \n" +
            "    department.name AS departmentName, \n" +
            "    {h-schema}get_list_chapter_subject_json(subject.id) AS lstChapterJson \n" +
            "FROM {h-schema}subject \n" +
            "    LEFT JOIN {h-schema}department ON subject.department_id = department.id \n" +
            "WHERE subject.is_enabled = true AND subject.deleted_flag = 1 AND subject.id = :subjectId";

    public static final String GET_ALL_SUBJECT_ID_CODE =
        "SELECT id, code FROM {h-schema}subject WHERE deleted_flag = 1";

}

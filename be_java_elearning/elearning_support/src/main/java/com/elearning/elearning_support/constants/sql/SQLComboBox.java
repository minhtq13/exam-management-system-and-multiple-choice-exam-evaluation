package com.elearning.elearning_support.constants.sql;

public class SQLComboBox {

    public static final String GET_LIST_SUBJECT_COMBO_BOX =
        "SELECT \n" +
            "   id AS id, \n" +
            "   title AS name, \n" +
            "   code AS code \n" +
            "FROM {h-schema}subject \n" +
            "WHERE \n" +
            "    (:subjectTitle = '' OR title ILIKE ('%' || :subjectTitle || '%')) AND \n" +
            "    (:subjectCode = '' OR code ILIKE ('%' || :subjectCode || '%'))";

    public static final String GET_LIST_CHAPTER_COMBO_BOX =
        "SELECT \n" +
            "    id AS id, \n" +
            "    CONCAT_WS('. ', TEXT(orders), title)AS name, \n" +
            "    code AS code \n" +
            "FROM {h-schema}chapter \n" +
            "WHERE \n" +
            "    subject_id = :subjectId AND \n" +
            "    (:chapterTitle = '' OR title ILIKE ('%' || :chapterTitle || '%')) AND \n" +
            "    (:chapterCode = '' OR code ILIKE ('%' || :chapterCode || '%'))" +
            "ORDER BY orders";


    public static final String GET_LIST_USER_WITH_TYPE_COMBO_BOX =
        "SELECT \n" +
            "    id AS id, \n" +
            "    CONCAT_WS(' ', last_name, first_name) AS name, \n" +
            "    code AS code \n" +
            "FROM {h-schema}users \n" +
            "WHERE \n" +
            "    status = 1 AND \n" +
            "    deleted_flag = 1 AND \n" +
            "    user_type = :userType AND \n" +
            "    (:name = '' OR CONCAT_WS(' ', last_name, first_name) ILIKE ('%' || :name || '%')) AND \n" +
            "    (:code = '' OR code ILIKE ('%' || :code || '%'))";

    public static final String GET_LIST_ROLE_WITHOUT_SUPER_ADMIN =
        "SELECT \n" +
            "   id AS id, \n" +
            "   code AS code, \n" +
            "   displayed_name AS name \n" +
            "FROM {h-schema}role \n" +
            "WHERE \n" +
            "   (:userType IN (-2, -1) OR (:userType = 0 AND code ILIKE '%TEACHER%') OR (:userType = 1 AND code ILIKE '%STUDENT%')) AND \n" +
            "   ('' = :search OR displayed_name ILIKE ('%' || :search || '%') OR code ILIKE ('%' || :search || '%')) AND \n" +
            "   code <> 'ROLE_SUPER_ADMIN'";

    public static final String GET_LIST_SEMESTER =
        "SELECT * FROM {h-schema}semester WHERE ('' = :search OR code ILIKE ('%' || :search || '%')) ";


    public static final String GET_LIST_TEST =
        "SELECT id, name FROM {h-schema}test WHERE ('' = :search OR name ILIKE ('%' || :search || '%')) ";

    public static final String GET_LIST_EXAM_CLASS =
        "SELECT \n" +
            "   exClass.id AS id, \n" +
            "   exClass.code AS code \n" +
            "FROM {h-schema}exam_class AS exClass \n" +
            "   JOIN {h-schema}test ON exClass.test_id = test.id \n" +
            "WHERE \n" +
            "   (-1 = :semesterId OR exClass.semester_id = :semesterId) AND \n" +
            "   (-1 = :subjectId OR test.subject_id = :subjectId) AND \n" +
            "   ('' = :search OR exClass.code = :search)";

}

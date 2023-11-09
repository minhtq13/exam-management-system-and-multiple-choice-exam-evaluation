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


}

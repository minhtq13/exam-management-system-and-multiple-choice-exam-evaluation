package com.elearning.elearning_support.constants.sql;

public class SQLUser {

    public static final String GET_USER_DETAIL =
        "SELECT \n" +
            "    users.id AS id,\n" +
            "    users.code AS code, \n" +
            "    users.last_name AS lastName, \n" +
            "    users.first_name AS firstName, \n" +
            "    CONCAT_WS(' ', users.last_name, users.first_name) AS name, \n" +
            "    users.identification_number AS identificationNum,\n" +
            "    CASE \n" +
            "           WHEN users.identity_type = 0 THEN 'Chứng minh thư nhân dân' \n" +
            "           WHEN users.identity_type = 1 THEN 'Căn cước công dân' \n" +
            "           WHEN users.identity_type = 2 THEN 'Hộ chiếu' \n" +
            "           ELSE '' \n" +
            "     END AS identityType, \n" +
            "     users.birth_date AS birthDate, \n" +
            "     users.phone_number AS phoneNumber, \n" +
            "     users.address AS address, \n" +
            "     users.email AS email, \n" +
            "     CASE \n" +
            "          WHEN users.gender = 0 THEN 'FEMALE' \n" +
            "          WHEN users.gender = 1 THEN 'MALE' \n" +
            "          ELSE 'OTHER' \n" +
            "     END AS gender, \n" +
            "     CASE \n" +
            "         WHEN users.user_type = 1 THEN users.meta_data->>'courseNum' \n" +
            "     END AS courseNum, \n" +
            "     users.created_at AS createdAt, \n" +
            "     users.modified_at AS modifiedAt, \n" +
            "     department.name AS department, \n" +
            "     department.id AS departmentId, \n" +
            "     users.user_type AS userType, \n" +
            "     avatar.id AS avatarId, \n" +
            "     COALESCE(avatar.file_path, avatar.external_link) AS avatarPath, \n" +
            "     {h-schema}get_user_role_json(users.id) AS roleJson \n" +
            "FROM {h-schema}users \n" +
            "     LEFT JOIN {h-schema}department ON users.department_id = department.id \n" +
            "     LEFT JOIN {h-schema}file_attach AS avatar ON users.avatar_id = avatar.id AND avatar.type IN (0,1) \n" +
            "WHERE \n" +
            "     users.id = :userId AND users.deleted_flag = 1 ";

    public static final String GET_LIST_STUDENT =
        "SELECT \n" +
            "     student.id AS id, \n" +
            "     student.code AS code, \n" +
            "     avatar.file_path AS avatarPath, \n" +
            "     student.first_name AS firstName, \n" +
            "     student.last_name AS lastName, \n" +
            "     student.birth_date AS birthDate, \n" +
            "     student.phone_number AS phoneNumber, \n" +
            "     CASE \n" +
            "          WHEN student.gender = 0 THEN 'FEMALE' \n" +
            "          WHEN student.gender = 1 THEN 'MALE' \n" +
            "          ELSE 'OTHER' \n" +
            "     END AS gender, \n" +
            "     student.email AS email, \n" +
            "     student.meta_data->>'courseNum' AS courseNum, \n" +
            "     'Học Sinh / Sinh Viên' AS userType, \n" +
            "     COALESCE(student.modified_at, student.created_at) AS lastModifiedAt \n" +
            "FROM {h-schema}users AS student \n" +
            "     JOIN {h-schema}view_user_student_role AS roleStudent ON student.id = roleStudent.user_id \n" +
            "     LEFT JOIN {h-schema}file_attach AS avatar ON student.avatar_id = avatar.id AND avatar.type = 0 \n" +
            "WHERE \n" +
            "    student.status = 1 AND \n" +
            "    student.deleted_flag = 1 AND \n" +
            "    student.user_type = 1 AND \n" +
            "    ('' = :search OR CONCAT_WS(' ', student.last_name, student.first_name) ILIKE ('%' || :search || '%') OR student.code ILIKE ('%' || :search || '%')) AND \n" +
            "    (-1 IN (:courseNums) OR COALESCE(student.meta_data->>'courseNum', '-1')::::int4 IN (:courseNums)) ";

    public static final String GET_LIST_TEACHER =
        "SELECT  \n" +
            "   teacher.id AS id, \n" +
            "   teacher.code AS code, \n" +
            "   avatar.file_path AS avatarPath, \n" +
            "   teacher.first_name AS firstName, \n" +
            "   teacher.last_name AS lastName, \n" +
            "   teacher.birth_date AS birthDate, \n" +
            "   CASE \n" +
            "       WHEN teacher.gender = 0 THEN 'FEMALE' \n" +
            "       WHEN teacher.gender = 1 THEN 'MALE' \n" +
            "       ELSE 'OTHER' \n" +
            "   END AS gender, \n" +
            "   teacher.phone_number AS phoneNumber, \n" +
            "   teacher.email AS email, \n" +
            "   'Giáo Viên / Giảng Viên' AS userType, \n" +
            "   department.name AS departmentName, \n" +
            "   COALESCE(teacher.modified_at, teacher.created_at) AS lastModifiedAt \n" +
            "FROM {h-schema}users AS teacher \n" +
            "   JOIN {h-schema}view_user_teacher_role AS roleTeacher ON teacher.id = roleTeacher.user_id \n" +
            "   LEFT JOIN {h-schema}file_attach AS avatar ON teacher.avatar_id = avatar.id AND avatar.type = 0 \n" +
            "   LEFT JOIN {h-schema}department ON teacher.department_id = department.id \n" +
            "WHERE \n" +
            "  teacher.status = 1 AND \n" +
            "  teacher.deleted_flag = 1 AND \n" +
            "  teacher.user_type = 0 AND \n" +
            "  ('' = :search OR CONCAT_WS(' ', teacher.last_name, teacher.first_name) ILIKE ('%' || :search || '%') OR teacher.code ILIKE ('%' || :search || '%'))\n";

    public static final String GET_LIST_CURRENT_USERNAME =
        "SELECT username FROM {h-schema}users";

    public static final String GET_LIST_CURRENT_USER_EMAIL =
        "SELECT email FROM {h-schema}users";

    public static final String GET_LIST_CURRENT_USER_CODE_BY_USER_TYPE =
        "SELECT code FROM {h-schema}users WHERE user_type = :userType";

    public static final String DELETE_USER_ROLE_BY_USER_ID =
        "DELETE FROM {h-schema}users_roles WHERE user_id = :userId";

    public static final String GET_LIST_USER_ID_CODE_BY_CODE_AND_USER_TYPE =
        "SELECT id, code FROM {h-schema}users WHERE code IN (:lstCode) AND user_type = :userType AND deleted_flag = 1";

    public static final String FIND_STUDENT_ID_BY_UNIQUE_INFO =
        "SELECT users.id \n" +
            "FROM {h-schema}users \n" +
            "   JOIN {h-schema}view_user_student_role as vStudent ON vStudent.user_id = users.id \n" +
            "WHERE \n" +
            "   (users.email = :email) OR (users.username = :username) OR (users.code = :code AND users.user_type = 1)";

}

package com.elearning.elearning_support.constants.sql;

public class SQLUser {

    public static final String GET_DETAIL_USER =
        "SELECT \n" +
            "    users.id AS id,\n" +
            "    users.code AS code, \n" +
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
            "     users.created_at AS createdAt, \n" +
            "     users.modified_at AS modifiedAt, \n" +
            "     department.name AS department, \n" +
            "     department.id AS departmentId \n" +
            "FROM {h-schema}users \n" +
            "     LEFT JOIN {h-schema}department ON users.department_id = department.id \n" +
            "WHERE \n" +
            "     users.id = :userId ";


    public static final String GET_LIST_STUDENT =
        "SELECT \n" +
            "     student.id AS id, \n" +
            "     student.code AS code, \n" +
            "     avatar.file_path AS avatarPath, \n" +
            "     student.first_name AS firstName, \n" +
            "     student.last_name AS lastName, \n" +
            "     student.birth_date AS birthDate, \n" +
            "     student.phone_number AS phoneNumber, \n" +
            "     student.email AS email, \n" +
            "     'Học Sinh / Sinh Viên' AS userType, \n" +
            "     COALESCE(student.modified_at, student.created_at) AS lastModifiedAt \n" +
            "FROM {h-schema}users AS student \n" +
            "     JOIN {h-schema}view_user_student_role AS roleStudent ON student.id = roleStudent.user_id \n" +
            "     LEFT JOIN {h-schema}file_attach AS avatar ON student.avatar_id = avatar.id AND avatar.type = 0 \n" +
            "WHERE \n" +
            "    student.status = 1 AND \n" +
            "    student.deleted_flag = 1 AND \n" +
            "    student.user_type = 1 AND \n" +
            "    ('' = :name OR CONCAT_WS(' ', student.last_name, student.first_name) ILIKE ('%' || :name || '%')) AND \n" +
            "    ('' = :code OR student.code ILIKE ('%' || :code || '%')) ";

    public static final String GET_LIST_TEACHER =
        "SELECT  \n" +
            "   teacher.id AS id, \n" +
            "   teacher.code AS code, \n" +
            "   avatar.file_path AS avatarPath, \n" +
            "   teacher.first_name AS firstName, \n" +
            "   teacher.last_name AS lastName, \n" +
            "   teacher.birth_date AS birthDate, \n" +
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
            "  ('' = :name OR CONCAT_WS(' ', teacher.last_name, teacher.first_name) ILIKE ('%' || :name || '%')) AND \n" +
            "  ('' = :code OR teacher.code ILIKE ('%' || :code || '%')) ";



}

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

}

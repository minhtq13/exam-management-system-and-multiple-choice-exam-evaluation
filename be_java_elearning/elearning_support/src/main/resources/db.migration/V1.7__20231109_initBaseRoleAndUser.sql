INSERT INTO "elearning_support_dev"."role" ("code", "name", "displayed_name", is_default)
VALUES
    ('ROLE_STUDENT', 'STUDENT', 'Học sinh/Sinh viên (Student)', true),
    ('ROLE_TEACHER', 'TEACHER', 'Giáo viên/Giảng viên (Teacher/Lecturer)', true);

-- Init a student -- password = chiendh
INSERT INTO "elearning_support_dev"."users" ("identification_number", "identity_type", "code", "first_name", "last_name", "username", "password",
                                             "created_at", "created_by", "status", "gender", "user_type", "department_id", "created_source")
VALUES ('001203349452', 1, '20192718', 'Chien', 'Dao', 'chien.dh192718', '$2a$12$UiHO95slCi4ws3a3RbAXt.B8TpimZg3862H2zeFQyc2aqPxlfsHq6', now(), 1, 1, 1, 1, -1, 0);

-- Init a teacher -- password = gvtest
INSERT INTO "elearning_support_dev"."users" ("identification_number", "identity_type", "code", "first_name", "last_name", "username", "password",
                                             "created_at", "created_by", "status", "gender", "user_type", "department_id", "created_source")
VALUES ('001939394856', 1, 'GV2029293', 'GV', 'Test', 'gvtest', '$2a$12$m0eZDtbAsbWbT75eSgzWsuXXKJaOAFUBG2rkQl2dLYsGpTdKlo1Ea', now(), 1, 1, 1, 0, -1, 0);
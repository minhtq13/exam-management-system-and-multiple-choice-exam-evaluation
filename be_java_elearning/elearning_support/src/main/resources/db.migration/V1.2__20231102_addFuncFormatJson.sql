-- Get list file attach by ids
DROP FUNCTION IF EXISTS elearning_support_dev.get_list_file_json_by_ids_id(i_file_ids int8[]);
CREATE OR REPLACE FUNCTION elearning_support_dev.get_list_file_json_by_ids_id(i_file_ids int8[])
    RETURNS TEXT
AS
$$

DECLARE
    result TEXT;

BEGIN
    SELECT '[' ||
           string_agg(format('{"id": %s, "fileName": %s, "filePath": %s, "fileExt": %s}',
               to_json(file.id), to_json(file.name), to_json(file.file_path), to_json(file.file_ext)), ',') || ']' AS file_attach_json
    INTO result
    FROM elearning_support_dev.file_attach AS file
    WHERE file.id = ANY (i_file_ids);
    RETURN result;
END
$$
    LANGUAGE plpgsql;

-- Get list question answers --
DROP FUNCTION IF EXISTS elearning_support_dev.get_list_answer_json_by_question_id(i_question_id int8);
CREATE OR REPLACE FUNCTION elearning_support_dev.get_list_answer_json_by_question_id(i_question_id int8)
    RETURNS TEXT
AS
$$

DECLARE
    result TEXT;

BEGIN
    SELECT '[' ||
           string_agg(format('{"id": %s, "content": %s, "isCorrect": %s}',
                             to_json(answer.id), to_json(answer.content), to_json(answer.is_correct)), ',') || ']' AS lst_answer_json
    INTO result
    FROM elearning_support_dev.answer
    WHERE answer.question_id = i_question_id;
    RETURN result;
END
$$
    LANGUAGE plpgsql;


-- Func get json: test_set_question_answer
DROP FUNCTION IF EXISTS elearning_support_dev.get_list_test_question_answer_json(i_test_question_answer jsonb);
CREATE OR REPLACE FUNCTION elearning_support_dev.get_list_test_question_answer_json(i_test_question_answer jsonb)
    RETURNS TEXT
AS
$$

DECLARE
    result TEXT;

BEGIN
    with testAnswerJson as (
        select
            testAnswer."answerNo" AS "answerNo",
            testAnswer."answerId" AS "answerId",
            answer.content AS "content"
        from jsonb_to_recordset(i_test_question_answer) as testAnswer("answerId" int8, "answerNo" int4)
                 join elearning_support_dev.answer ON testAnswer."answerId" = answer.id
        order by testAnswer."answerNo"
    ) select json_agg(row_to_json(testAnswerJson)) from testAnswerJson
    INTO result;
    RETURN result;
END
$$
    LANGUAGE plpgsql;


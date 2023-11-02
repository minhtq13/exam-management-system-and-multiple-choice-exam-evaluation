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


package com.elearning.elearning_support.constants.message.messageConst;

public class MessageConst {

    public static class Resources {
        public static final String QUESTION = "question";

        public static final String SUBJECT = "subject";

        public static final String CHAPTER = "chapter";

        public static final String TEST = "test";

        public static final String FILE_ATTACHED = "file_attached";
    }

    public static final String RESOURCE_NOT_FOUND = "not found";

    public static final String RESOURCE_EXISTED = "existed";

    public static final String RESOURCE_OVERLAPPED = "overlapped";
    public static final String RESOURCE_DUPLICATED = "duplicated";

    public static final String PERMISSIONS_DENIED = "permission denied";

    public static final String UPLOAD_FAILED = "upload failed";

    public static class Question {
        public static final String NOT_FOUND = "error.question.not.found";
    }

    public static class Subject {
        public static final String NOT_FOUND = "error.subject.not.found";
    }

    public static class Chapter {
        public static final String NOT_FOUND = "error.chapter.not.found";
    }

    public static class Test {
        public static final String NOT_FOUND = "error.test.not.found";
    }


    public static class FileAttach{

        public static final String UPLOAD_ERROR_CODE = "file_attach.error.upload";
        public static final String NOT_FOUND_ERROR_CODE = "file_attach.error.not.found";

        public static final String EXISTED_ERROR_CODE = "file_attach.error.existed";

        public static final String DUPLICATED_ERROR_CODE = "file_attach.error.duplicated";

        public static final String PERMISSION_DENIED_ERROR_CODE = "file_attach.error.permission.denied";
    }


}

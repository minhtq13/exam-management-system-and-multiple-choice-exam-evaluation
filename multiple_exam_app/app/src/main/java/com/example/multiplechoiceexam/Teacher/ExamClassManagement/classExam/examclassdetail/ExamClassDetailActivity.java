package com.example.multiplechoiceexam.Teacher.ExamClassManagement.classExam.examclassdetail;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RadioGroup;
import android.widget.Toast;

import com.example.multiplechoiceexam.Api.ApiService;
import com.example.multiplechoiceexam.Api.RetrofitClient;
import com.example.multiplechoiceexam.R;
import com.example.multiplechoiceexam.SharedPreferences.AccountSharedPreferences;
import com.example.multiplechoiceexam.Teacher.ExamClassManagement.classExam.examclass.StudentTestClassExamActivity;
import com.example.multiplechoiceexam.dto.examClass.IExamClassParticipantDTO;
import com.example.multiplechoiceexam.dto.examClass.UserExamClassRoleEnum;
import com.example.multiplechoiceexam.dto.student.StudentResponse;
import com.example.multiplechoiceexam.dto.teacher.TeacherResponse;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExamClassDetailActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 2;
    private static final int PICK_EXCEL_REQUEST_STUDENT_CLASS = 1;
    private RecyclerView recyclerExamStudentDetail;
    private ApiService apiService;
    private Long id;
    private Integer flag = 0;
    private String examClassCode;
    UserExamClassRoleEnum selectedRole = UserExamClassRoleEnum.STUDENT;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam_class_detail);


        apiService = RetrofitClient.getApiService(getApplicationContext());
        RadioGroup radioGroup = findViewById(R.id.radioGroup);
        FloatingActionButton buttonAddStudentClass = findViewById(R.id.add_student_class_exam);
        recyclerExamStudentDetail =findViewById(R.id.class_exam_detail_recycler);
        AccountSharedPreferences accountSharedPreferences = new AccountSharedPreferences(this);
        List<String> userRoles = accountSharedPreferences.getRoles();
        if (userRoles.contains("STUDENT")) {
            buttonAddStudentClass.setVisibility(View.GONE);

        }

        radioGroup.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.radioStudent) {
                selectedRole = UserExamClassRoleEnum.STUDENT;
            } else if (checkedId == R.id.radioSupervisor) {
                selectedRole = UserExamClassRoleEnum.SUPERVISOR;
            } else {
                selectedRole = UserExamClassRoleEnum.STUDENT;
            }
            getAllStudentById(id);
        });


        buttonAddStudentClass.setOnClickListener(view -> dialogAddStudentClass());
        findViewById(R.id.imageView_examClassDetail_back).setOnClickListener(v -> finish());

        id = getIntent().getLongExtra("id", -1);
        examClassCode = getIntent().getStringExtra("examClassCode");

        getAllStudentById(id);

    }

    private void getAllStudentById(Long id) {
        Call<List<IExamClassParticipantDTO>> call = apiService.getListExamClassParticipant(id,selectedRole);
        call.enqueue(new Callback<List<IExamClassParticipantDTO>>() {
            @Override
            public void onResponse(@NotNull Call<List<IExamClassParticipantDTO>> call, @NotNull Response<List<IExamClassParticipantDTO>> response) {
                List<IExamClassParticipantDTO> classDetailResponse = response.body();
                getAllData(classDetailResponse);
                Toast.makeText(ExamClassDetailActivity.this, "thành công" , Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(@NotNull Call<List<IExamClassParticipantDTO>> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassDetailActivity.this, "lỗi" , Toast.LENGTH_SHORT).show();
            }
        });

    }
    @SuppressLint("NotifyDataSetChanged")
    private void getAllData(List<IExamClassParticipantDTO> iExamClassParticipantDTOS) {
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        recyclerExamStudentDetail.setLayoutManager(layoutManager);
        ExamClassDetailAdapter examClassDetailAdapter = new ExamClassDetailAdapter(iExamClassParticipantDTOS, this, flag);
        recyclerExamStudentDetail.setAdapter(examClassDetailAdapter);
        examClassDetailAdapter.notifyDataSetChanged();
    }

    private void dialogAddStudentClass() {
        Dialog dialog = new Dialog(ExamClassDetailActivity.this);
        dialog.setContentView(R.layout.option_add_student_item);
        ImageView imageAddStudent = dialog.findViewById(R.id.add_student_dialog);
        ImageView importStudentClass =  dialog.findViewById(R.id.import_student_add);
        Button cancel =  dialog.findViewById(R.id.cancel_button);
        cancel.setOnClickListener(v -> dialog.dismiss());

        imageAddStudent.setOnClickListener(view -> {
            callApiAndGetStudents();
            dialog.dismiss();
        });
        importStudentClass.setOnClickListener(view -> {
            callApiAndGetTeacher();
//                callApiAndImportStudentByExcel();
            dialog.dismiss();
        });
        dialog.show();
    }

    private void callApiAndGetTeacher() {
        apiService.getListTeacher("").enqueue(new Callback<List<TeacherResponse>>() {
            @Override
            public void onResponse(@NotNull Call<List<TeacherResponse>> call,@NotNull Response<List<TeacherResponse>> response) {
                if (response.isSuccessful()) {
                    List<TeacherResponse> teacherResponses = response.body();
                    showTeacherSelectionDialog(teacherResponses);
                } else {
                    Toast.makeText(ExamClassDetailActivity.this, "Lấy danh sách giảng viên thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NotNull Call<List<TeacherResponse>> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassDetailActivity.this, "Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showTeacherSelectionDialog(List<TeacherResponse> teacherResponses) {
        Intent intent = new Intent(ExamClassDetailActivity.this, StudentTestClassExamActivity.class);
        intent.putParcelableArrayListExtra("teacher_list", new ArrayList<>(teacherResponses));
        intent.putExtra("examClassId", id);
        intent.putExtra("check", "teacher");
        intent.putExtra("role",selectedRole.toString());
        startActivity(intent);
    }

    private void callApiAndImportStudentByExcel() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        try {
            startActivityForResult(Intent.createChooser(intent, "Chọn tệp Excel"), PICK_EXCEL_REQUEST_STUDENT_CLASS);
        } catch (android.content.ActivityNotFoundException ignored) {

        }
    }
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//
//        if (requestCode == PICK_EXCEL_REQUEST_STUDENT_CLASS && resultCode == RESULT_OK) {
//            if (data != null) {
//                Uri excelFileUri = data.getData();
//                fileUtils = new FileUtils(ExamClassDetailActivity.this);
//                excelFilePath = fileUtils.getPath(excelFileUri);
//            }if (excelFilePath != null) {
//               // importStudentFromExcel();
//            } else {
//                // Handle the case when filePath is null
//                Toast.makeText(this, "Failed to get file path", Toast.LENGTH_SHORT).show();
//            }
//        } else {
//            // Handle the case when data or data.getData() is null
//            Toast.makeText(this, "No file selected", Toast.LENGTH_SHORT).show();
//        }
//
//    }

//    private void importStudentFromExcel() {
//        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
//                != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
//        } else {
//            File excelFile = new File(excelFilePath);
//            String fileName = excelFile.getName().replaceAll("[^a-zA-Z0-9.-]", "_");
//            if (!excelFile.exists()) {
//                // Xử lý khi tệp tin không tồn tại
//                System.out.println("File does not exist!");
//                return;
//            }
//
//            RequestBody requestFile1 = RequestBody.create(MediaType.parse("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"), excelFile);
//            MultipartBody.Part excelFilePart = MultipartBody.Part.createFormData("file",fileName, requestFile1);
//            RequestBody examClassCodeRequestBody = RequestBody.create(MediaType.parse("text/plain"), examClassCode);
//            Call<ResponseMessage> call = apiService.importStudents(examClassCodeRequestBody,excelFilePart);
//            call.enqueue(new Callback<ResponseMessage>() {
//                @Override
//                public void onResponse(@NotNull Call<ResponseMessage> call,@NotNull Response<ResponseMessage> response) {
//                    if (response.isSuccessful()) {
//                        ResponseMessage responseMessage = response.body();
//                        if (responseMessage != null) {
//                            getAllStudentById(id);
//                            Toast.makeText(ExamClassDetailActivity.this, responseMessage.getMessage(), Toast.LENGTH_SHORT).show();
//                        }
//                    } else {
//                        Toast.makeText(ExamClassDetailActivity.this, "Có lỗi xảy ra khi đẩy tệp Excel lên máy chủ", Toast.LENGTH_SHORT).show();
//                    }
//                }
//
//                @Override
//                public void onFailure(@NotNull Call<ResponseMessage> call,@NotNull Throwable t) {
//                    // Xử lý lỗi kết nối
//                    Toast.makeText(ExamClassDetailActivity.this, "Lỗi kết nối", Toast.LENGTH_SHORT).show();
//                }
//            });
//        }
//    }

    @Override
    public void onResume() {
        super.onResume();
        getAllStudentById(id);
    }

    private void callApiAndGetStudents() {
        apiService.getListStudent("",-1).enqueue(new Callback<List<StudentResponse>>() {
            @Override
            public void onResponse(@NotNull Call<List<StudentResponse>> call,@NotNull Response<List<StudentResponse>> response) {
                if (response.isSuccessful()) {
                    List<StudentResponse> studentResponseList = response.body();
                    showStudentSelectionDialog(studentResponseList);
                } else {
                    Toast.makeText(ExamClassDetailActivity.this, "Lấy danh sách sinh viên thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NotNull Call<List<StudentResponse>> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassDetailActivity.this, "Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showStudentSelectionDialog(List<StudentResponse> studentList) {
        Intent intent = new Intent(ExamClassDetailActivity.this, StudentTestClassExamActivity.class);
        intent.putParcelableArrayListExtra("student_list", new ArrayList<>(studentList));
        intent.putExtra("examClassId", id);
        intent.putExtra("check", "student");
        intent.putExtra("role",selectedRole.toString());
        startActivity(intent);
    }



}
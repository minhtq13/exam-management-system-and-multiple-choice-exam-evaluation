package com.example.multiplechoiceexam.Teacher.ExamClassManagement.classExam.examclass;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.example.multiplechoiceexam.Api.ApiService;
import com.example.multiplechoiceexam.Api.RetrofitClient;
import com.example.multiplechoiceexam.R;
import com.example.multiplechoiceexam.Utils.ValidateInputData;
import com.example.multiplechoiceexam.dto.examClass.ClassRequest;
import com.example.multiplechoiceexam.dto.student.StudentResponse;
import com.example.multiplechoiceexam.dto.teacher.TeacherResponse;
import com.example.multiplechoiceexam.dto.test.TestClassResponse;
import com.google.android.material.textfield.TextInputEditText;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExamClassAddActivity extends AppCompatActivity {

    private static final int REQUEST_CODE_NEW_ACTIVITY = 123;
    private static final int REQUEST_CODE_NEW_ACTIVITY_TEACHER = 321;
    private TextInputEditText editClassRoom, editTextTeacher, editClassHk, editClassTestCodeId,editTextStudent,editExamineTime;
    private Button btnClassExamSave;
    private List<Long> selectedStudents, selectedTeachers;
    private String formattedTime,date;
    private Long testId;
    private ApiService apiService;
    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam_class_add);

        List<TestClassResponse> testClassResponseList = new ArrayList<>();
        selectedStudents = new ArrayList<>();
        apiService = RetrofitClient.getApiService(getApplicationContext());
        findViewById(R.id.imageView_examClassAdd_back).setOnClickListener(v ->
            finish());

        anhXa();
        editExamineTime.setOnClickListener(v -> showTimePickerDialog());
        btnClassExamSave.setOnClickListener(view -> saveClassExam());
        editClassTestCodeId.setOnClickListener(view -> callApiAndGetItemTest());
        editTextStudent.setOnClickListener(view -> callApiAndGetStudents());
        editTextTeacher.setOnClickListener(view -> callApiAndGetTeachers());
    }

    private void callApiAndGetTeachers() {
        apiService.getListTeacher("").enqueue(new Callback<List<TeacherResponse>>() {
            @Override
            public void onResponse(@NotNull Call<List<TeacherResponse>> call, @NotNull Response<List<TeacherResponse>> response) {
                if (response.isSuccessful()) {
                    List<TeacherResponse> teacherResponses = response.body();
                    showTeacherSelectionDialog(teacherResponses);
                } else {
                    Toast.makeText(ExamClassAddActivity.this, "Lấy danh sách giảng viên thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NotNull Call<List<TeacherResponse>> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassAddActivity.this, "Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showTeacherSelectionDialog(List<TeacherResponse> teacherResponses) {
        Intent intent = new Intent(ExamClassAddActivity.this, StudentTestClassExamActivity.class);
        intent.putParcelableArrayListExtra("teacher_list", new ArrayList<>(teacherResponses));
        startActivityForResult(intent, REQUEST_CODE_NEW_ACTIVITY_TEACHER);
    }

    private void showTimePickerDialog() {
        Calendar calendar = Calendar.getInstance();
        final int year = calendar.get(Calendar.YEAR);
        final int month = calendar.get(Calendar.MONTH);
        final int day = calendar.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(ExamClassAddActivity.this, (datePicker, year1, month1, day1) -> {
            int formattedMonth = month1 + 1;

            TimePickerDialog timePickerDialog = new TimePickerDialog(ExamClassAddActivity.this, (timePicker, hourOfDay, minute) -> {
                formattedTime = String.format("%02d:%02d", hourOfDay, minute);
                date = String.format("%s %02d/%02d/%d", formattedTime, day1, formattedMonth, year1);

                editExamineTime.setText(date);
            }, 0, 0, true);
            timePickerDialog.show();
        }, year, month, day);

        datePickerDialog.show();
    }

    private void saveClassExam() {
        ClassRequest classRequest = new ClassRequest();
        String roomName = Objects.requireNonNull(editClassRoom.getText()).toString().trim();

        if(!ValidateInputData.stringNotNull(roomName, editClassRoom)){
            return;
        }

        String code = Objects.requireNonNull(editClassHk.getText()).toString().trim();
        if(!ValidateInputData.stringNotNull(code, editClassHk)){
            return;
        }
        classRequest.setRoomName(roomName);
        classRequest.setCode(code);
        classRequest.setExamineTime(date);
        classRequest.setTestId(testId);
        classRequest.setLstSupervisorId(selectedTeachers);
        classRequest.setLstStudentId(selectedStudents);

        apiService.createClass(classRequest).enqueue(new Callback<Long>() {
            @Override
            public void onResponse(@NotNull Call<Long> call,@NotNull Response<Long> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(ExamClassAddActivity.this, "Tạo phòng thi thành công", Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    Toast.makeText(ExamClassAddActivity.this, "Tạo phòng thi thất bại", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NotNull Call<Long> call,@NotNull Throwable t) {
                     Toast.makeText(ExamClassAddActivity.this, "Lỗi call", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_CODE_NEW_ACTIVITY && resultCode == Activity.RESULT_OK) {
            if (data != null) {
                    ArrayList<Integer> selectedStudentIdsInt = data.getIntegerArrayListExtra("selected_student_ids");
                    if (selectedStudentIdsInt != null) {
                        List<Long> selectedStudentIdsLong = new ArrayList<>();
                        for (Integer idInt : selectedStudentIdsInt) {
                            selectedStudentIdsLong.add(idInt != null ? idInt.longValue() : null);
                        }
                        selectedStudents = new ArrayList<>(selectedStudentIdsLong);
                        editTextStudent.setText(selectedStudents.toString());
                    }
            }
        }
        if (requestCode == REQUEST_CODE_NEW_ACTIVITY_TEACHER && resultCode == Activity.RESULT_OK) {
            if (data != null) {
                    ArrayList<Integer> selectedTeacherIdsInt = data.getIntegerArrayListExtra("selected_teacher_ids");
                    if (selectedTeacherIdsInt != null) {
                        List<Long> selectedTeacherIdsLong = new ArrayList<>();
                        for (Integer idInt : selectedTeacherIdsInt) {
                            selectedTeacherIdsLong.add(idInt != null ? idInt.longValue() : null);
                        }
                        selectedTeachers = new ArrayList<>(selectedTeacherIdsLong);
                        editTextTeacher.setText(selectedTeachers.toString());
                    }
            }
        }
    }

    private void callApiAndGetStudents() {
        apiService.getListStudent("",-1).enqueue(new Callback<List<StudentResponse>>() {
            @Override
            public void onResponse(@NotNull Call<List<StudentResponse>> call,@NotNull Response<List<StudentResponse>> response) {
                if (response.isSuccessful()) {
                    List<StudentResponse> studentResponseList = response.body();
                    showStudentSelectionDialog(studentResponseList);
                } else {
                    Toast.makeText(ExamClassAddActivity.this, "Lấy danh sách sinh viên thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NotNull Call<List<StudentResponse>> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassAddActivity.this, "Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });


    }

    private void showStudentSelectionDialog(List<StudentResponse> studentList) {
        Intent intent = new Intent(ExamClassAddActivity.this, StudentTestClassExamActivity.class);
        intent.putParcelableArrayListExtra("student_list", new ArrayList<>(studentList));
        intent.putExtra("studentcheck", true);
        startActivityForResult(intent, REQUEST_CODE_NEW_ACTIVITY);
    }

    private void callApiAndGetItemTest() {
        Call<TestClassResponse> call = apiService.getTestList(
                -1L,
                "ALL",
                "",
                "",
                -1L,
                "",
                0,
                10000,
                "modifiedAt"
        );

        call.enqueue(new Callback<TestClassResponse>() {
            @Override
            public void onResponse(@NotNull Call<TestClassResponse> call,@NotNull Response<TestClassResponse> response) {
                if (response.isSuccessful()) {
                    TestClassResponse testClassResponse = response.body();
                    assert testClassResponse != null;
                    List<TestClassResponse.TestItem> testItems =  testClassResponse.getContent();
                    showDialogTestID(testItems);
                    Toast.makeText(ExamClassAddActivity.this, " thành công", Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(ExamClassAddActivity.this, " thất bại", Toast.LENGTH_SHORT).show();

                }
            }
            @Override
            public void onFailure(@NotNull Call<TestClassResponse> call,@NotNull Throwable t) {
                Toast.makeText(ExamClassAddActivity.this, "Lỗi", Toast.LENGTH_SHORT).show();
            }
        });



    }

    private void showDialogTestID(List<TestClassResponse.TestItem> testClassResponseList) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Chọn môn học");

        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_test_class, null);
        builder.setView(dialogView);

        RecyclerView recyclerViewMonHoc = dialogView.findViewById(R.id.recyclerViewMonHoc);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerViewMonHoc.setLayoutManager(layoutManager);

        TessClassExamIdAdapter adapter = new TessClassExamIdAdapter(testClassResponseList,getApplicationContext());
        recyclerViewMonHoc.setAdapter(adapter);

        builder.setNegativeButton("Hủy", (dialog, which) -> dialog.dismiss());
        AlertDialog dialog = builder.create();
        dialog.show();

        adapter.setOnItemClickListener(testClassItem -> {
            editClassTestCodeId.setText(testClassItem.getSubjectCode());
            testId = Long.valueOf(testClassItem.getId());
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
            } else {
                // Handle the case where alertDialog is unexpectedly null or not showing
                Log.e("ExamClassAddActivity", "AlertDialog is null or not showing");
            }
        });


    }

    private void anhXa() {
        editClassRoom = findViewById(R.id.txt_class_room_name);
        editExamineTime = findViewById(R.id.txt_class_semester);
        editClassHk = findViewById(R.id.txt_class_code);
        editClassTestCodeId = findViewById(R.id.txt_class_test_id);
        editTextStudent = findViewById(R.id.txt_class_student);
        btnClassExamSave = findViewById(R.id.btn_class_exam_save);
        editTextTeacher = findViewById(R.id.txt_class_teacher);
    }
}
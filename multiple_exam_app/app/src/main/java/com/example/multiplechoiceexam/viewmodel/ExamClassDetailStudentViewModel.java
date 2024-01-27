package com.example.multiplechoiceexam.viewmodel;
import android.app.Application;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.multiplechoiceexam.Api.ApiService;
import com.example.multiplechoiceexam.Api.RetrofitClient;
import com.example.multiplechoiceexam.dto.studentTest.StudentTestSetResultDTO;

import org.jetbrains.annotations.NotNull;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExamClassDetailStudentViewModel extends ViewModel {
    private final ApiService apiService;
    private final MutableLiveData<List<StudentTestSetResultDTO>> studentTestSetResultData = new MutableLiveData<>();
    Context context;

    public ExamClassDetailStudentViewModel(@NonNull Application application) {
        this.context = application.getApplicationContext();
        apiService = RetrofitClient.getApiService(context);
    }

    public MutableLiveData<List<StudentTestSetResultDTO>> getStudentTestSetResult(String examClassCode) {
        apiService.getStudentTestSetResult(examClassCode).enqueue(new Callback<List<StudentTestSetResultDTO>>() {
            @Override
            public void onResponse(@NotNull Call<List<StudentTestSetResultDTO>> call, @NotNull Response<List<StudentTestSetResultDTO>> response) {
                if (response.isSuccessful()) {
                    studentTestSetResultData.setValue(response.body());
                } else {
                    studentTestSetResultData.setValue(null);
                }
            }

            @Override
            public void onFailure(@NotNull Call<List<StudentTestSetResultDTO>> call,@NotNull Throwable t) {
                studentTestSetResultData.setValue(null);
            }
        });

        return studentTestSetResultData;
    }

}

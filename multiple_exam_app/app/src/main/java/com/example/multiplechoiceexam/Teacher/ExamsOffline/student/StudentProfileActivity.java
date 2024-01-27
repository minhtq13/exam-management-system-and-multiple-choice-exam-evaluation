package com.example.multiplechoiceexam.Teacher.ExamsOffline.student;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;

import com.example.multiplechoiceexam.R;
import com.example.multiplechoiceexam.databinding.ActivityStudentProfileBinding;


public class StudentProfileActivity extends AppCompatActivity {

    private ActivityStudentProfileBinding binding;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityStudentProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        getDataFromIntent();
        initEvent();

    }



    @SuppressLint("SetTextI18n")
    private void getDataFromIntent() {

        binding.textviewDetailStudentName.setText(getIntent().getStringExtra("student_name"));
        binding.textviewDetailStudentDob.setText(getIntent().getStringExtra("student_birth"));
        binding.textviewDetailStudentId.setText(getIntent().getStringExtra("student_code"));
        binding.textviewDetailStudentK.setText("K" + getIntent().getIntExtra("student_course",0));
        String email = getIntent().getStringExtra("student_email");
        SpannableString emailUnderLine = new SpannableString(email);
        emailUnderLine.setSpan(new UnderlineSpan(), 0, email.length(), 0);
        binding.textviewDetailStudentEmail.setText(emailUnderLine);

        String genderTmp = getIntent().getStringExtra("student_gender");
        if (genderTmp == null || genderTmp.equals("MALE")) {
            binding.textviewDetailStudentSex.setText("Nam");
        } else {
            binding.textviewDetailStudentSex.setText("Nữ");
        }
        String phone = getIntent().getStringExtra("student_phone");
        SpannableString phoneUnderLine = new SpannableString(phone);
        phoneUnderLine.setSpan(new UnderlineSpan(), 0, phone.length(), 0);
        binding.textviewDetailStudentPhone.setText(phoneUnderLine);
    }

    private void initEvent() {
        binding.textviewDetailStudentPhone.setOnClickListener(v -> {
            Intent callIntent = new Intent(Intent.ACTION_DIAL);
            String phone = binding.textviewDetailStudentPhone.getText().toString();
            callIntent.setData(Uri.parse("tel:" + phone));
            startActivity(callIntent);
        });
        binding.textviewDetailStudentEmail.setOnClickListener(v -> {
            Intent emailIntent = new Intent(Intent.ACTION_SENDTO);
            String email = binding.textviewDetailStudentEmail.getText().toString();
            emailIntent.setData(Uri.parse("mailto:" + email));
            startActivity(emailIntent);
        });
        findViewById(R.id.imageView_studentProfile_back).setOnClickListener(v -> finish());
    }
}
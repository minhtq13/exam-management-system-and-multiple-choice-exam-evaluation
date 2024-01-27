package com.example.multiplechoiceexam.Teacher.ExamsOffline.teacher;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;

import com.example.multiplechoiceexam.databinding.ActivityTeacherProfileBinding;

public class TeacherProfileActivity extends AppCompatActivity {
    private ActivityTeacherProfileBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityTeacherProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        getDataFromIntent();
        initEvent();
    }

    @SuppressLint("SetTextI18n")
    private void getDataFromIntent() {

        binding.textviewDetailTeacherName.setText(getIntent().getStringExtra("teacher_name_1"));
        binding.textviewDetailTeacherDob.setText(getIntent().getStringExtra("teacher_birth_1"));
        binding.textviewDetailTeacherId.setText(getIntent().getStringExtra("teacher_code_1"));
        String email = getIntent().getStringExtra("teacher_email_1");
        SpannableString emailUnderLine = new SpannableString(email);
        emailUnderLine.setSpan(new UnderlineSpan(), 0, email.length(), 0);
        binding.textviewDetailTeacherEmail.setText(emailUnderLine);

        String genderTmp = getIntent().getStringExtra("teacher_gender_1");
        if (genderTmp == null || genderTmp.equals("MALE")) {
            binding.textviewDetailTeacherSex.setText("Nam");
        } else {
            binding.textviewDetailTeacherSex.setText("Nữ");
        }
        String phone = getIntent().getStringExtra("teacher_phone_1");
        SpannableString phoneUnderLine = new SpannableString(phone);
        phoneUnderLine.setSpan(new UnderlineSpan(), 0, phone.length(), 0);
        binding.textviewDetailTeacherPhone.setText(phoneUnderLine);
    }

    private void initEvent() {
        binding.textviewDetailTeacherPhone.setOnClickListener(v -> {
            Intent callIntent = new Intent(Intent.ACTION_DIAL);
            String phone = binding.textviewDetailTeacherPhone.getText().toString();
            callIntent.setData(Uri.parse("tel:" + phone));
            startActivity(callIntent);
        });
        binding.textviewDetailTeacherEmail.setOnClickListener(v -> {
            Intent emailIntent = new Intent(Intent.ACTION_SENDTO);
            String email = binding.textviewDetailTeacherEmail.getText().toString();
            emailIntent.setData(Uri.parse("mailto:" + email));
            startActivity(emailIntent);
        });
    }
}
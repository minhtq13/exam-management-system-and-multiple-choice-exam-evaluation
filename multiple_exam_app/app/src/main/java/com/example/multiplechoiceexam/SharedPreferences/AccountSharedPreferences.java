package com.example.multiplechoiceexam.SharedPreferences;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AccountSharedPreferences {
    private static final String PREF_NAME = "account_prefs";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";
    private static final String KEY_MESSAGE = "message";
    private static final String KEY_ISSUEDAT = "issuedAt";
    private static final String KEY_ROLES = "roles";

    private String accessToken;
    private String refreshToken;
    private Object message;
    private String issuedAt;
    private String roles;

    private SharedPreferences preferences;
    public AccountSharedPreferences() {
    }

    public AccountSharedPreferences(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        accessToken = preferences.getString(KEY_ACCESS_TOKEN, null);
        refreshToken = preferences.getString(KEY_REFRESH_TOKEN, null);
        message = preferences.getString(KEY_MESSAGE, null);
        issuedAt = preferences.getString(KEY_ISSUEDAT, null);
        roles = preferences.getString(KEY_ROLES, null);
    }

    // Các phương thức getter và setter cho các trường

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(KEY_ACCESS_TOKEN, accessToken);
        editor.apply();
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(KEY_REFRESH_TOKEN, refreshToken);
        editor.apply();
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
        SharedPreferences.Editor editor = preferences.edit();
        // Chuyển đối tượng message thành chuỗi và lưu vào SharedPreferences (nếu có thể chuyển đổi)
        if (message != null) {
            String messageStr = message.toString();
            editor.putString(KEY_MESSAGE, messageStr);
        } else {
            editor.remove(KEY_MESSAGE); // Xóa trường message nếu nó không tồn tại
        }
        editor.apply();
    }

    public String getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(String username) {
        this.issuedAt = username;
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(KEY_ISSUEDAT, username);
        editor.apply();
    }


    public List<String> getRoles() {
        if (roles != null) {
            return new ArrayList<>(Arrays.asList(roles.split(",")));
        }
        return new ArrayList<>();
    }

    public void setRoles(List<String> roles) {
        this.roles = TextUtils.join(",", roles); // Chuyển danh sách thành chuỗi và lưu vào SharedPreferences
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(KEY_ROLES, this.roles);
        editor.apply();
    }
    public void clear() {
        SharedPreferences.Editor editor = preferences.edit();
        editor.remove(KEY_ACCESS_TOKEN);
        editor.remove(KEY_REFRESH_TOKEN);
        editor.remove(KEY_MESSAGE);
        editor.remove(KEY_ISSUEDAT);
        editor.remove(KEY_ROLES);
        editor.apply();
    }
}

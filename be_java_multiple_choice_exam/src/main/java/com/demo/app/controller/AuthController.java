package com.demo.app.controller;

import com.demo.app.dto.auth.AuthenticationRequest;
import com.demo.app.dto.auth.AuthenticationResponse;
import com.demo.app.dto.auth.RegisterRequest;
import com.demo.app.exception.DuplicatedUniqueValueException;
import com.demo.app.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;


@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login and Register User's account")
public class AuthController {

    private final AuthService authService;

    @PostMapping(path = "/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid final AuthenticationRequest request) {
        AuthenticationResponse authResponse = authService.login(request);
        return ResponseEntity.ok()
                .header("token", authResponse.getAccessToken())
                .body(authResponse);
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<?> registerUser(@RequestBody @Valid final RegisterRequest registerRequest,
                                          final HttpServletRequest request) throws DuplicatedUniqueValueException {
        var authResponse = authService.register(registerRequest, request);
        return ResponseEntity.ok()
                .header("token", authResponse.getAccessToken())
                .body(authResponse);
    }

    @PostMapping(path = "/refresh-token")
    public void refreshToken(HttpServletRequest request,
                             HttpServletResponse response) throws IOException {
        authService.refreshToken(request, response);
    }
}

package com.vcube.BankingApplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.BankingApplication.dto.AuthDTOs.LoginRequest;
import com.vcube.BankingApplication.dto.AuthDTOs.OtpRequest;
import com.vcube.BankingApplication.dto.AuthDTOs.RegisterRequest;
import com.vcube.BankingApplication.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
		return ResponseEntity.ok(authService.register(req));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest req) {
		return ResponseEntity.ok(authService.login(req));
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest req) {
		return ResponseEntity.ok(authService.verifyOtp(req));
	}
}

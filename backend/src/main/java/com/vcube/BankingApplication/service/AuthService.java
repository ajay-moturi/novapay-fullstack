package com.vcube.BankingApplication.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vcube.BankingApplication.dto.AuthDTOs.AuthResponse;
import com.vcube.BankingApplication.dto.AuthDTOs.LoginRequest;
import com.vcube.BankingApplication.dto.AuthDTOs.MessageResponse;
import com.vcube.BankingApplication.dto.AuthDTOs.OtpRequest;
import com.vcube.BankingApplication.dto.AuthDTOs.RegisterRequest;
import com.vcube.BankingApplication.entity.OtpVerification;
import com.vcube.BankingApplication.entity.User;
import com.vcube.BankingApplication.repository.OtpRepository;
import com.vcube.BankingApplication.repository.UserRepository;
import com.vcube.BankingApplication.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OtpRepository otpRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private EmailService emailService;

	// ── Register ──────────────────────────────────────────────
	public MessageResponse register(RegisterRequest req) {
		if (userRepository.existsByEmail(req.getEmail()))
			throw new RuntimeException("Email already registered");

		User user = new User();
		user.setName(req.getName());
		user.setEmail(req.getEmail());
		user.setPassword(passwordEncoder.encode(req.getPassword()));
		user.setRole(User.Role.USER);
		userRepository.save(user);

		sendOtp(user);
		return new MessageResponse("Registered! Please verify OTP sent to your email.");
	}

	// ── Login ─────────────────────────────────────────────────
	public MessageResponse login(LoginRequest req) {

		// Step 1 — find user by email
		User user = userRepository.findByEmail(req.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid email or password"));

		// Step 2 — check password manually
		if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid email or password");
		}

		// Step 3 — send OTP
		sendOtp(user);
		return new MessageResponse("OTP sent to your email.");
	}

	// ── Verify OTP ────────────────────────────────────────────
	public AuthResponse verifyOtp(OtpRequest req) {
		User user = userRepository.findByEmail(req.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		OtpVerification otpRecord = otpRepository.findTopByUserAndUsedFalseOrderByIdDesc(user)
				.orElseThrow(() -> new RuntimeException("No OTP found. Please login again."));

		if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now()))
			throw new RuntimeException("OTP expired. Please login again.");

		if (!otpRecord.getOtp().equals(req.getOtp()))
			throw new RuntimeException("Invalid OTP.");

		otpRecord.setUsed(true);
		otpRepository.save(otpRecord);

		user.setVerified(true);
		userRepository.save(user);

		String token = jwtUtil.generateToken(user.getEmail());
		return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
	}

	// ── Send OTP ──────────────────────────────────────────────
	// Fix: wrapped email in try-catch so email failure
	// does NOT block the login flow
	private void sendOtp(User user) {
		String otp = String.format("%06d", new Random().nextInt(999999));

		// Save OTP to database
		OtpVerification record = new OtpVerification();
		record.setUser(user);
		record.setOtp(otp);
		record.setExpiresAt(LocalDateTime.now().plusMinutes(5));
		record.setUsed(false);
		otpRepository.save(record);

		// ✅ Print OTP in Eclipse console — use this to test
		System.out.println("========================================");
		System.out.println("OTP for " + user.getEmail() + " : " + otp);
		System.out.println("========================================");

		// Try sending email — if fails, OTP still works via console
		try {
			emailService.sendOtp(user.getEmail(), user.getName(), otp);
			System.out.println("OTP email sent successfully to: " + user.getEmail());
		} catch (Exception e) {
			// Email failed but OTP is saved in DB
			// User can still use OTP printed in console
			System.err.println("Email sending failed: " + e.getMessage());
			System.err.println("Use OTP from console above to verify.");
		}
	}
}

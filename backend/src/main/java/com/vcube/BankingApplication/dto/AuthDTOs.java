package com.vcube.BankingApplication.dto;

import lombok.Data;

public class AuthDTOs {
	@Data
	public static class RegisterRequest {
		private String name;
		private String email;
		private String password;
	}

	@Data
	public static class LoginRequest {
		private String email;
		private String password;
	}

	@Data
	public static class OtpRequest {
		private String email;
		private String otp;
	}

	@Data
	public static class AuthResponse {
		private String token;
		private String name;
		private String email;
		private String role;

		public AuthResponse(String token, String name, String email, String role) {
			this.token = token;
			this.name = name;
			this.email = email;
			this.role = role;
		}
	}

	@Data
	public static class MessageResponse {
		private String message;

		public MessageResponse(String message) {
			this.message = message;
		}
	}
}

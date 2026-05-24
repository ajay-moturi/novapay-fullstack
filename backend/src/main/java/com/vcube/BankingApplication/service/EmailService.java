package com.vcube.BankingApplication.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
	private final JavaMailSender mailSender;

	public void sendOtp(String to, String name, String otp) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("NovaPay - Your OTP Code");
		message.setText("Hi " + name + ",\n\nYour OTP for login is: " + otp
				+ "\n\nThis OTP is valid for 5 minutes. Do not share it with anyone.\n\nNovaPay Team");
		mailSender.send(message);
	}

	public void sendTransactionAlert(String to, String name, String details) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("NovaPay - Transaction Alert");
		message.setText("Hi " + name + ",\n\n" + details
				+ "\n\nIf this was not you, please contact support immediately.\n\nNovaPay Team");
		mailSender.send(message);
	}
}

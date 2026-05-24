package com.vcube.BankingApplication.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.BankingApplication.dto.TransactionDTOs.TransferRequest;
import com.vcube.BankingApplication.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
	private final TransactionService transactionService;

	@PostMapping("/transfer")
	public ResponseEntity<?> transfer(@AuthenticationPrincipal UserDetails user, @RequestBody TransferRequest req) {
		return ResponseEntity.ok(transactionService.transfer(user.getUsername(), req));
	}

	@GetMapping("/history")
	public ResponseEntity<?> history(@AuthenticationPrincipal UserDetails user,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(transactionService.getHistory(user.getUsername(), page, size));
	}

	@GetMapping("/analytics/spending")
	public ResponseEntity<?> spendingByCategory(@AuthenticationPrincipal UserDetails user) {
		return ResponseEntity.ok(transactionService.getSpendingByCategory(user.getUsername()));
	}
}

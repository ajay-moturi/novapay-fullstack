package com.vcube.BankingApplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.BankingApplication.dto.TransactionDTOs.CreateAccountRequest;
import com.vcube.BankingApplication.service.AccountService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
	private final AccountService accountService;
	 
    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails user,
                                    @RequestBody CreateAccountRequest req) {
        return ResponseEntity.ok(accountService.createAccount(user.getUsername(), req));
    }
 
    @GetMapping
    public ResponseEntity<?> getAccounts(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(accountService.getUserAccounts(user.getUsername()));
    }
}

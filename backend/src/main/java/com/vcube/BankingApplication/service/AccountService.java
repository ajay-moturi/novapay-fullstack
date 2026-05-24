package com.vcube.BankingApplication.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.BankingApplication.dto.TransactionDTOs.AccountResponse;
import com.vcube.BankingApplication.dto.TransactionDTOs.CreateAccountRequest;
import com.vcube.BankingApplication.entity.Account;
import com.vcube.BankingApplication.entity.User;
import com.vcube.BankingApplication.repository.AccountRepository;
import com.vcube.BankingApplication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
public class AccountService {
	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private UserRepository userRepository;

	// ── Create Account ────────────────────────────────────────
	public AccountResponse createAccount(String email, CreateAccountRequest req) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Account account = new Account();
		account.setAccountNumber(generateAccountNumber());
		account.setType(Account.AccountType.valueOf(req.getType().toUpperCase()));
		account.setUser(user);
		account = accountRepository.save(account);
		return toResponse(account);
	}

	// ── Get User Accounts ─────────────────────────────────────
	public List<AccountResponse> getUserAccounts(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Fix: use findByUserId(Long) — no User type conflict
		List<Account> accounts = accountRepository.findByUserId(user.getId());

		List<AccountResponse> result = new ArrayList<AccountResponse>();
		for (Account acc : accounts) {
			result.add(toResponse(acc));
		}
		return result;
	}

	// ── Generate Account Number ───────────────────────────────
	private String generateAccountNumber() {
		String num;
		do {
			num = String.valueOf(1000000000L + (long) (new Random().nextDouble() * 9000000000L));
		} while (accountRepository.findByAccountNumber(num).isPresent());
		return num;
	}

	// ── Map Account to Response ───────────────────────────────
	public AccountResponse toResponse(Account a) {
		AccountResponse res = new AccountResponse();
		res.setId(a.getId());
		res.setAccountNumber(a.getAccountNumber());
		res.setType(a.getType().name());
		res.setBalance(a.getBalance());
		res.setStatus(a.getStatus().name());
		return res;
	}

}

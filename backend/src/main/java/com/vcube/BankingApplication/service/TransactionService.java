package com.vcube.BankingApplication.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vcube.BankingApplication.dto.TransactionDTOs.AnalyticsResponse;
import com.vcube.BankingApplication.dto.TransactionDTOs.TransactionResponse;
import com.vcube.BankingApplication.dto.TransactionDTOs.TransferRequest;
import com.vcube.BankingApplication.entity.Account;
import com.vcube.BankingApplication.entity.FraudAlert;
import com.vcube.BankingApplication.entity.Transaction;
import com.vcube.BankingApplication.entity.User;
import com.vcube.BankingApplication.repository.AccountRepository;
import com.vcube.BankingApplication.repository.FraudAlertRepository;
import com.vcube.BankingApplication.repository.TransactionRepository;
import com.vcube.BankingApplication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
public class TransactionService {
	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private FraudAlertRepository fraudAlertRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	// ── Fund Transfer (ACID) ──────────────────────────────────
	@Transactional
	public TransactionResponse transfer(String email, TransferRequest req) {
		Account from = accountRepository.findByAccountNumber(req.getFromAccountNumber())
				.orElseThrow(() -> new RuntimeException("Source account not found"));
		Account to = accountRepository.findByAccountNumber(req.getToAccountNumber())
				.orElseThrow(() -> new RuntimeException("Destination account not found"));

		if (!from.getUser().getEmail().equals(email))
			throw new RuntimeException("Unauthorized access to account");

		if (from.getStatus() != Account.AccountStatus.ACTIVE)
			throw new RuntimeException("Source account is not active");

		if (from.getBalance().compareTo(req.getAmount()) < 0)
			throw new RuntimeException("Insufficient balance");

		from.setBalance(from.getBalance().subtract(req.getAmount()));
		to.setBalance(to.getBalance().add(req.getAmount()));
		accountRepository.save(from);
		accountRepository.save(to);

		// Fix: use setters instead of builder
		Transaction tx = new Transaction();
		tx.setFromAccount(from);
		tx.setToAccount(to);
		tx.setAmount(req.getAmount());
		tx.setType(Transaction.TransactionType.TRANSFER);
		tx.setCategory(req.getCategory());
		tx.setDescription(req.getDescription());
		tx.setStatus(Transaction.TransactionStatus.SUCCESS);
		tx = transactionRepository.save(tx);

		checkFraud(tx, from);

		emailService.sendTransactionAlert(email, from.getUser().getName(),
				"Transfer of Rs." + req.getAmount() + " to account " + req.getToAccountNumber() + " was successful.");

		return toResponse(tx);
	}

	// ── Fraud Check ───────────────────────────────────────────
	private void checkFraud(Transaction tx, Account account) {
		List<String> reasons = new ArrayList<String>();

		if (tx.getAmount().compareTo(new BigDecimal("50000")) > 0) {
			reasons.add("Large transfer: Rs." + tx.getAmount());
		}

		List<Transaction> recent = transactionRepository.findByFromAccountAndCreatedAtAfter(account,
				LocalDateTime.now().minusMinutes(10));
		if (recent.size() > 5) {
			reasons.add("Multiple transfers in short time");
		}

		if (!reasons.isEmpty()) {
			// Fix: use setters instead of builder
			FraudAlert alert = new FraudAlert();
			alert.setTransaction(tx);
			alert.setUser(account.getUser());
			alert.setReason(String.join(", ", reasons));
			alert.setSeverity(tx.getAmount().compareTo(new BigDecimal("100000")) > 0 ? FraudAlert.Severity.HIGH
					: FraudAlert.Severity.MEDIUM);
			fraudAlertRepository.save(alert);

			// Fix: use plain String instead of Map for convertAndSend
			Long userId = account.getUser().getId();
			String topic = "/topic/fraud/" + userId;
			String message = "{" + "\"reason\":\"" + alert.getReason() + "\"," + "\"severity\":\""
					+ alert.getSeverity().name() + "\"," + "\"amount\":\"" + tx.getAmount() + "\"," + "\"time\":\""
					+ tx.getCreatedAt() + "\"" + "}";

			messagingTemplate.convertAndSend(topic, message);
		}
	}

	// ── Transaction History ───────────────────────────────────
	public Page<TransactionResponse> getHistory(String email, int page, int size) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Fix: use findByUserId instead of findByUser
		List<Account> accounts = accountRepository.findByUserId(user.getId());
		if (accounts.isEmpty())
			return Page.empty();

		Account primary = accounts.get(0);
		return transactionRepository.findByAccount(primary, PageRequest.of(page, size)).map(this::toResponse);
	}

	// ── Spending Analytics ────────────────────────────────────
	public List<AnalyticsResponse> getSpendingByCategory(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Fix: use findByUserId instead of findByUser
		List<Account> accounts = accountRepository.findByUserId(user.getId());
		if (accounts.isEmpty())
			return Collections.emptyList();

		List<Transaction> txs = transactionRepository.findByAccountAndDateAfter(accounts.get(0),
				LocalDateTime.now().minusDays(30));

		Map<String, BigDecimal> byCategory = new LinkedHashMap<String, BigDecimal>();
		for (Transaction t : txs) {
			if (t.getType() == Transaction.TransactionType.DEBIT
					|| t.getType() == Transaction.TransactionType.TRANSFER) {
				String cat = t.getCategory() != null ? t.getCategory() : "Other";
				BigDecimal existing = byCategory.get(cat);
				if (existing == null) {
					byCategory.put(cat, t.getAmount());
				} else {
					byCategory.put(cat, existing.add(t.getAmount()));
				}
			}
		}

		// Fix: use setters instead of builder for AnalyticsResponse
		List<AnalyticsResponse> result = new ArrayList<AnalyticsResponse>();
		for (Map.Entry<String, BigDecimal> entry : byCategory.entrySet()) {
			AnalyticsResponse ar = new AnalyticsResponse(entry.getKey(), entry.getValue());
			result.add(ar);
		}
		return result;
	}

	// ── Map Transaction to Response ───────────────────────────
	// Fix: use setters instead of builder
	private TransactionResponse toResponse(Transaction t) {
		TransactionResponse res = new TransactionResponse();
		res.setId(t.getId());
		res.setFromAccount(t.getFromAccount() != null ? t.getFromAccount().getAccountNumber() : null);
		res.setToAccount(t.getToAccount() != null ? t.getToAccount().getAccountNumber() : null);
		res.setAmount(t.getAmount());
		res.setType(t.getType().name());
		res.setCategory(t.getCategory());
		res.setDescription(t.getDescription());
		res.setStatus(t.getStatus().name());
		res.setCreatedAt(t.getCreatedAt());
		return res;
	}
}

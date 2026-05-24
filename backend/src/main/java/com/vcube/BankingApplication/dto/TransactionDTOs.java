package com.vcube.BankingApplication.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class TransactionDTOs {
	@Data
	public static class TransferRequest {
		private String fromAccountNumber;
		private String toAccountNumber;
		private BigDecimal amount;
		private String category;
		private String description;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TransactionResponse {
		private Long id;
		private String fromAccount;
		private String toAccount;
		private BigDecimal amount;
		private String type;
		private String category;
		private String description;
		private String status;
		private LocalDateTime createdAt;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class AccountResponse {
		private Long id;
		private String accountNumber;
		private String type;
		private BigDecimal balance;
		private String status;
	}

	@Data
	public static class CreateAccountRequest {
		private String type;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class AnalyticsResponse {
		private String category;
		private BigDecimal total;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class MonthlyResponse {
		private String month;
		private BigDecimal income;
		private BigDecimal expense;
	}
}

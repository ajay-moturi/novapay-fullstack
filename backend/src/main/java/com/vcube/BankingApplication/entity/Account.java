package com.vcube.BankingApplication.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(unique = true, nullable = false)
    private String accountNumber;
 
    @Enumerated(EnumType.STRING)
    private AccountType type = AccountType.SAVINGS;
 
    private BigDecimal balance = BigDecimal.ZERO;
 
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
 
    private LocalDateTime createdAt = LocalDateTime.now();
 
    public enum AccountType { SAVINGS, CURRENT }
    public enum AccountStatus { ACTIVE, BLOCKED, CLOSED }
}



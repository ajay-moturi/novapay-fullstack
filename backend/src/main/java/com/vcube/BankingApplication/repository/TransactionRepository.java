package com.vcube.BankingApplication.repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.vcube.BankingApplication.entity.Account;
import com.vcube.BankingApplication.entity.Transaction;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	@Query("SELECT t FROM Transaction t WHERE t.fromAccount = :account OR t.toAccount = :account ORDER BY t.createdAt DESC")
	Page<Transaction> findByAccount(Account account, Pageable pageable);

	@Query("SELECT t FROM Transaction t WHERE t.fromAccount = :account OR t.toAccount = :account ORDER BY t.createdAt DESC")
	List<Transaction> findAllByAccount(Account account);

	@Query("SELECT t FROM Transaction t WHERE (t.fromAccount = :account OR t.toAccount = :account) AND t.createdAt >= :from")
	List<Transaction> findByAccountAndDateAfter(Account account, LocalDateTime from);

	@Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.toAccount = :account AND t.type = 'CREDIT' AND t.createdAt >= :from")
	BigDecimal sumCreditAfter(Account account, LocalDateTime from);

	List<Transaction> findByFromAccountAndCreatedAtAfter(Account account, LocalDateTime after);
}

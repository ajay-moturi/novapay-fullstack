package com.vcube.BankingApplication.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vcube.BankingApplication.entity.FraudAlert;
import com.vcube.BankingApplication.entity.User;

public interface FraudAlertRepository extends JpaRepository<FraudAlert,Long>{

	List<FraudAlert> findByUserOrderByCreatedAtDesc(User user);

	List<FraudAlert> findByResolvedFalse();
}

package com.vcube.BankingApplication.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.vcube.BankingApplication.entity.FraudAlert;
import com.vcube.BankingApplication.entity.User;
import com.vcube.BankingApplication.repository.FraudAlertRepository;
import com.vcube.BankingApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class FraudService {
	private final FraudAlertRepository fraudAlertRepository;
	private final UserRepository userRepository;

	public List<FraudAlert> getUserAlerts(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		return fraudAlertRepository.findByUserOrderByCreatedAtDesc(user);
	}

	public FraudAlert resolveAlert(Long alertId) {
		FraudAlert alert = fraudAlertRepository.findById(alertId)
				.orElseThrow(() -> new RuntimeException("Alert not found"));
		alert.setResolved(true);
		return fraudAlertRepository.save(alert);
	}
}

package com.vcube.BankingApplication.scheduler;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.vcube.BankingApplication.entity.FraudAlert;
import com.vcube.BankingApplication.repository.FraudAlertRepository;
import com.vcube.BankingApplication.service.EmailService;
@Component
public class FraudScheduler {
	@Autowired
	private FraudAlertRepository fraudAlertRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Scheduled(fixedRate = 3600000) // runs every 1 hour
	public void scanUnresolvedAlerts() {

		List<FraudAlert> unresolvedAlerts = fraudAlertRepository.findByResolvedFalse();

		System.out.println("Fraud scan: " + unresolvedAlerts.size() + " unresolved alerts found");

		for (FraudAlert alert : unresolvedAlerts) {

			if (alert.getSeverity() == FraudAlert.Severity.HIGH) {

				// ── Send email alert ──────────────────────────
				try {
					String userEmail = alert.getUser().getEmail();
					String userName = alert.getUser().getName();
					String reason = alert.getReason();

					emailService.sendTransactionAlert(userEmail, userName,
							"URGENT: Unresolved HIGH severity fraud alert: " + reason);
				} catch (Exception e) {
					System.err.println("Failed to send fraud email: " + e.getMessage());
				}

				// ── Send WebSocket push ───────────────────────
				// Fix: get userId separately to avoid chaining error
				Long userId = alert.getUser().getId();
				String topic = "/topic/fraud/" + userId;
				String message = "{" + "\"type\":\"REMINDER\"," + "\"reason\":\"" + alert.getReason() + "\","
						+ "\"severity\":\"" + alert.getSeverity().name() + "\"" + "}";

				messagingTemplate.convertAndSend(topic, message);
			}

		}
	}
}

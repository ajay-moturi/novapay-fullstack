package com.vcube.BankingApplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vcube.BankingApplication.service.FraudService;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudController {
	private final FraudService fraudService;
	 
    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(fraudService.getUserAlerts(user.getUsername()));
    }
 
    @PutMapping("/resolve/{id}")
    public ResponseEntity<?> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(fraudService.resolveAlert(id));
    }
}

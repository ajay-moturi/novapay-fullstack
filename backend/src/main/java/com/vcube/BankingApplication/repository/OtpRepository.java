package com.vcube.BankingApplication.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.vcube.BankingApplication.entity.OtpVerification;
import com.vcube.BankingApplication.entity.User;

public interface OtpRepository extends JpaRepository<OtpVerification,Long> {
	Optional<OtpVerification> findTopByUserAndUsedFalseOrderByIdDesc(User user);

}

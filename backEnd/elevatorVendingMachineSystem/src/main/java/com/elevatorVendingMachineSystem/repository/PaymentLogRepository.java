package com.elevatorVendingMachineSystem.repository;

import com.elevatorVendingMachineSystem.domain.PaymentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentLogRepository extends JpaRepository<PaymentLog, Long> {
}
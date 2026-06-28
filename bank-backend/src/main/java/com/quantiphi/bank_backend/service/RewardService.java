package com.quantiphi.bank_backend.service;

import com.quantiphi.bank_backend.entity.Transaction;
import org.springframework.stereotype.Service;

@Service
public class RewardService {

    public void processRewards(Transaction transaction) {
        if ("DEBIT".equals(transaction.getType()) && transaction.getRawMessage() != null) {
            String msg = transaction.getRawMessage().toLowerCase();
            if (msg.contains("cashback") || msg.contains("reward")) {
                // E.g., 5% expected savings
                double expectedSavings = transaction.getAmount() * 0.05;
                transaction.setExpectedSavings(Math.round(expectedSavings * 100.0) / 100.0);
            }
        }
    }
}

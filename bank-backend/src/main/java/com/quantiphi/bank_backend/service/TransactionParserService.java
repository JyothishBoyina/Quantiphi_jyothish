package com.quantiphi.bank_backend.service;

import com.quantiphi.bank_backend.entity.Transaction;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TransactionParserService {

    // Example SMS: "Paid Rs. 250 to Zomato UPI ref..."
    // Example SMS: "Received Rs. 1200 from Private Company Ltd"
    private static final Pattern AMOUNT_PATTERN = Pattern.compile("Rs\\.?\\s*([0-9,]+\\.?[0-9]*)");

    public Transaction parseTransaction(String rawMessage) {
        Transaction transaction = new Transaction();
        transaction.setRawMessage(rawMessage);
        transaction.setTimestamp(LocalDateTime.now());

        // Extract amount
        Matcher amountMatcher = AMOUNT_PATTERN.matcher(rawMessage);
        if (amountMatcher.find()) {
            String amountStr = amountMatcher.group(1).replace(",", "");
            transaction.setAmount(Double.parseDouble(amountStr));
        } else {
            transaction.setAmount(0.0);
        }

        // Determine type and description
        String lowerMsg = rawMessage.toLowerCase();
        if (lowerMsg.contains("paid") || lowerMsg.contains("debited") || lowerMsg.contains("sent")) {
            transaction.setType("DEBIT");
        } else {
            transaction.setType("CREDIT");
        }

        // Extract Merchant and Auto-categorize
        String category = "Miscellaneous"; // Default
        String merchant = "Unknown";
        
        if (lowerMsg.contains("zomato")) {
            merchant = "Zomato";
            category = "Food & Dining";
        } else if (lowerMsg.contains("swiggy")) {
            merchant = "Swiggy";
            category = "Food & Dining";
        } else if (lowerMsg.contains("dominos") || lowerMsg.contains("mcdonald") || lowerMsg.contains("kfc")) {
            merchant = "Restaurant";
            category = "Food & Dining";
        } else if (lowerMsg.contains("uber")) {
            merchant = "Uber";
            category = "Travel";
        } else if (lowerMsg.contains("ola")) {
            merchant = "Ola";
            category = "Travel";
        } else if (lowerMsg.contains("rapido") || lowerMsg.contains("irctc") || lowerMsg.contains("makemytrip")) {
            merchant = "Travel Service";
            category = "Travel";
        } else if (lowerMsg.contains("salary") || lowerMsg.contains("private company")
                || lowerMsg.contains("employer") || lowerMsg.contains("pvt ltd")
                || lowerMsg.contains("ltd") || lowerMsg.contains("neft")
                || lowerMsg.contains("imps") || lowerMsg.contains("credited by")
                || lowerMsg.contains("received from")) {
            merchant = "Employer";
            category = "Salary";
        }

        transaction.setMerchant(merchant);
        transaction.setCategory(category);
        
        if (transaction.getType().equals("DEBIT")) {
            transaction.setDescription("Paid Rs. " + transaction.getAmount() + " to " + merchant);
        } else {
            transaction.setDescription("Received Rs. " + transaction.getAmount() + " from " + merchant);
        }

        return transaction;
    }
}

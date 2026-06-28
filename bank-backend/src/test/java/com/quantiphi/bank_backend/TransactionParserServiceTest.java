package com.quantiphi.bank_backend;

import com.quantiphi.bank_backend.entity.Transaction;
import com.quantiphi.bank_backend.service.TransactionParserService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TransactionParserServiceTest {

    private final TransactionParserService parserService = new TransactionParserService();

    @Test
    public void testFoodAndDiningCategorization() {
        String msg = "Paid Rs. 450 to Zomato for lunch";
        Transaction tx = parserService.parseTransaction(msg);
        
        assertEquals(450.0, tx.getAmount());
        assertEquals("DEBIT", tx.getType());
        assertEquals("Zomato", tx.getMerchant());
        assertEquals("Food & Dining", tx.getCategory());
    }

    @Test
    public void testTravelCategorization() {
        String msg = "Paid Rs. 250.50 to Uber for a ride";
        Transaction tx = parserService.parseTransaction(msg);
        
        assertEquals(250.50, tx.getAmount());
        assertEquals("DEBIT", tx.getType());
        assertEquals("Uber", tx.getMerchant());
        assertEquals("Travel", tx.getCategory());
    }

    @Test
    public void testSalaryCategorization() {
        String msg = "Received Rs. 50000 from Private Company Ltd";
        Transaction tx = parserService.parseTransaction(msg);
        
        assertEquals(50000.0, tx.getAmount());
        assertEquals("CREDIT", tx.getType());
        assertEquals("Employer", tx.getMerchant());
        assertEquals("Salary", tx.getCategory());
    }
}

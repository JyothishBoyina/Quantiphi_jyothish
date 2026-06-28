package com.quantiphi.bank_backend;

import com.quantiphi.bank_backend.entity.Transaction;
import com.quantiphi.bank_backend.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TransactionRepository repository;

    @BeforeEach
    public void setup() {
        repository.deleteAll();
    }

    @Test
    public void testParseTransactionEndpoint() throws Exception {
        String payload = "{\"rawMessage\": \"Paid Rs. 850 to Uber trips cashback applied\"}";

        mockMvc.perform(post("/api/transactions/parse")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount", is(850.0)))
                .andExpect(jsonPath("$.category", is("Travel")))
                .andExpect(jsonPath("$.expectedSavings", is(42.5)));
    }

    @Test
    public void testGetAllTransactionsEndpoint() throws Exception {
        Transaction tx = new Transaction();
        tx.setAmount(100.0);
        tx.setCategory("Miscellaneous");
        tx.setType("DEBIT");
        repository.save(tx);

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].amount", is(100.0)));
    }

    @Test
    public void testGetMetricsEndpoint() throws Exception {
        Transaction tx1 = new Transaction();
        tx1.setAmount(200.0);
        tx1.setCategory("Food & Dining");
        tx1.setType("DEBIT");
        repository.save(tx1);

        Transaction tx2 = new Transaction();
        tx2.setAmount(300.0);
        tx2.setCategory("Food & Dining");
        tx2.setType("DEBIT");
        repository.save(tx2);

        mockMvc.perform(get("/api/transactions/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.['Food & Dining']", is(500.0)));
    }
}

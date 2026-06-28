package com.quantiphi.bank_backend.controller;

import com.quantiphi.bank_backend.entity.Transaction;
import com.quantiphi.bank_backend.repository.TransactionRepository;
import com.quantiphi.bank_backend.service.RewardService;
import com.quantiphi.bank_backend.service.TransactionParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow all origins for dev
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionParserService parserService;

    @Autowired
    private RewardService rewardService;

    @PostMapping("/parse")
    public ResponseEntity<Transaction> parseAndSave(@RequestBody Map<String, String> payload) {
        String rawMessage = payload.get("rawMessage");
        if (rawMessage == null || rawMessage.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Transaction tx = parserService.parseTransaction(rawMessage);
        rewardService.processRewards(tx);
        
        Transaction saved = transactionRepository.save(tx);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    @PutMapping("/{id}/category")
    public ResponseEntity<Transaction> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newCategory = payload.get("category");
        return transactionRepository.findById(id).map(tx -> {
            tx.setCategory(newCategory);
            return ResponseEntity.ok(transactionRepository.save(tx));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Double>> getMetrics() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Double> metrics = new HashMap<>();

        double totalIncome = 0.0;

        for (Transaction tx : transactions) {
            if ("CREDIT".equalsIgnoreCase(tx.getType())) {
                // All credits → income bucket, regardless of category label
                totalIncome += tx.getAmount();
            } else {
                // All debits → their category bucket
                metrics.merge(tx.getCategory(), tx.getAmount(), Double::sum);
            }
        }

        // Expose income as a reserved key so frontend can read it cleanly
        metrics.put("__TOTAL_INCOME__", totalIncome);

        return ResponseEntity.ok(metrics);
    }
}

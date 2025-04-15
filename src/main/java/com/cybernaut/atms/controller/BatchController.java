package com.cybernaut.atms.controller;

import com.cybernaut.atms.model.Batch;
import com.cybernaut.atms.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable String id) {
        Optional<Batch> batch = batchService.getBatchById(id);
        return batch.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@RequestBody Batch batch) {
        return ResponseEntity.status(HttpStatus.CREATED).body(batchService.createBatch(batch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Batch> updateBatch(@PathVariable String id, @RequestBody Batch batchDetails) {
        Batch updatedBatch = batchService.updateBatch(id, batchDetails);
        if (updatedBatch != null) {
            return ResponseEntity.ok(updatedBatch);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable String id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lecturer/{lecturerId}")
    public ResponseEntity<List<Batch>> getBatchesByLecturerId(@PathVariable String lecturerId) {
        return ResponseEntity.ok(batchService.getBatchesByLecturerId(lecturerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Batch>> getBatchesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(batchService.getBatchesByStatus(status));
    }
}


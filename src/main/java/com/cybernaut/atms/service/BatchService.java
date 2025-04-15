package com.cybernaut.atms.service;

import com.cybernaut.atms.model.Batch;
import com.cybernaut.atms.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Optional<Batch> getBatchById(String id) {
        return batchRepository.findById(id);
    }

    public Batch createBatch(Batch batch) {
        return batchRepository.save(batch);
    }

    public Batch updateBatch(String id, Batch batchDetails) {
        Optional<Batch> batch = batchRepository.findById(id);
        if (batch.isPresent()) {
            Batch existingBatch = batch.get();
            existingBatch.setYear(batchDetails.getYear());
            existingBatch.setMonth(batchDetails.getMonth());
            existingBatch.setBatchName(batchDetails.getBatchName());
            existingBatch.setLecturer(batchDetails.getLecturer());
            existingBatch.setLecturerId(batchDetails.getLecturerId());
            existingBatch.setStartDate(batchDetails.getStartDate());
            existingBatch.setEndDate(batchDetails.getEndDate());
            existingBatch.setStatus(batchDetails.getStatus());
            existingBatch.setStudentsCompleted(batchDetails.getStudentsCompleted());
            existingBatch.setTotalStudents(batchDetails.getTotalStudents());
            existingBatch.setCompletionRate(batchDetails.getCompletionRate());
            return batchRepository.save(existingBatch);
        }
        return null;
    }

    public void deleteBatch(String id) {
        batchRepository.deleteById(id);
    }

    public List<Batch> getBatchesByLecturerId(String lecturerId) {
        return batchRepository.findByLecturerId(lecturerId);
    }

    public List<Batch> getBatchesByStatus(String status) {
        return batchRepository.findByStatus(status);
    }
}


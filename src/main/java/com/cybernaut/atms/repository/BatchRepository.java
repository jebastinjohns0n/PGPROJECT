package com.cybernaut.atms.repository;

import com.cybernaut.atms.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends MongoRepository<Batch, String> {
    List<Batch> findByLecturerId(String lecturerId);
    List<Batch> findByStatus(String status);
    List<Batch> findByYear(String year);
    List<Batch> findByYearAndMonth(String year, String month);
}


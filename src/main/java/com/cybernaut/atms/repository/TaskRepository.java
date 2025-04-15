package com.cybernaut.atms.repository;

import com.cybernaut.atms.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedToId(String assignedToId);
    List<Task> findByStatus(String status);
    List<Task> findByPriority(String priority);
}


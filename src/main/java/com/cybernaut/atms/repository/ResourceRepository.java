package com.cybernaut.atms.repository;

import com.cybernaut.atms.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByAssignedTo(String assignedTo);
    List<Resource> findByIsCloned(boolean isCloned);
    List<Resource> findByOriginalId(String originalId);
}


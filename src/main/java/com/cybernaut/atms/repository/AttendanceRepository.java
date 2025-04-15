package com.cybernaut.atms.repository;

import com.cybernaut.atms.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByUserId(String userId);
    List<Attendance> findByUserIdAndDate(String userId, LocalDate date);
    List<Attendance> findByStatus(String status);
}


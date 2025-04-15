package com.cybernaut.atms.repository;

import com.cybernaut.atms.model.Payroll;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends MongoRepository<Payroll, String> {
    List<Payroll> findByEmployeeId(String employeeId);
    List<Payroll> findByMonth(String month);
    List<Payroll> findByStatus(String status);
}


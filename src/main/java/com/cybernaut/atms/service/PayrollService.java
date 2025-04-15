package com.cybernaut.atms.service;

import com.cybernaut.atms.model.Payroll;
import com.cybernaut.atms.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public Optional<Payroll> getPayrollById(String id) {
        return payrollRepository.findById(id);
    }

    public Payroll createPayroll(Payroll payroll) {
        return payrollRepository.save(payroll);
    }

    public Payroll updatePayroll(String id, Payroll payrollDetails) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isPresent()) {
            Payroll existingPayroll = payroll.get();
            existingPayroll.setEmployee(payrollDetails.getEmployee());
            existingPayroll.setEmployeeId(payrollDetails.getEmployeeId());
            existingPayroll.setMonth(payrollDetails.getMonth());
            existingPayroll.setSalary(payrollDetails.getSalary());
            existingPayroll.setBonus(payrollDetails.getBonus());
            existingPayroll.setDeductions(payrollDetails.getDeductions());
            existingPayroll.setNetPay(payrollDetails.getNetPay());
            existingPayroll.setStatus(payrollDetails.getStatus());
            existingPayroll.setPaymentDate(payrollDetails.getPaymentDate());
            return payrollRepository.save(existingPayroll);
        }
        return null;
    }

    public void deletePayroll(String id) {
        payrollRepository.deleteById(id);
    }

    public List<Payroll> getPayrollsByEmployeeId(String employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    public List<Payroll> getPayrollsByMonth(String month) {
        return payrollRepository.findByMonth(month);
    }
}


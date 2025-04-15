package com.cybernaut.atms.service;

import com.cybernaut.atms.model.Attendance;
import com.cybernaut.atms.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Optional<Attendance> getAttendanceById(String id) {
        return attendanceRepository.findById(id);
    }

    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(String id, Attendance attendanceDetails) {
        Optional<Attendance> attendance = attendanceRepository.findById(id);
        if (attendance.isPresent()) {
            Attendance existingAttendance = attendance.get();
            existingAttendance.setDate(attendanceDetails.getDate());
            existingAttendance.setUserId(attendanceDetails.getUserId());
            existingAttendance.setUserName(attendanceDetails.getUserName());
            existingAttendance.setInTime(attendanceDetails.getInTime());
            existingAttendance.setOutTime(attendanceDetails.getOutTime());
            existingAttendance.setDuration(attendanceDetails.getDuration());
            existingAttendance.setStatus(attendanceDetails.getStatus());
            return attendanceRepository.save(existingAttendance);
        }
        return null;
    }

    public void deleteAttendance(String id) {
        attendanceRepository.deleteById(id);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getAttendanceByUserId(String userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public List<Attendance> getAttendanceByUserIdAndDate(String userId, LocalDate date) {
        return attendanceRepository.findByUserIdAndDate(userId, date);
    }
}


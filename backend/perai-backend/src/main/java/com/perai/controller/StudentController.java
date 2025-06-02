package com.perai.controller;

import com.perai.model.User;
import com.perai.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/v1/students")
@RestController
@AllArgsConstructor
public class StudentController {

    private StudentService studentService;

    @GetMapping("/search")
    public ResponseEntity<List<User>> getStudentByName(@RequestParam String name,
                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(studentService.getStudentsByName(name, size));
    }

    @GetMapping
    public ResponseEntity<List<User>> getStudentList(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getStudentList(user));
    }
}
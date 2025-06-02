package com.perai.controller;

import com.perai.dto.StudentDictionaryRequest;
import com.perai.model.StudentDictionary;
import com.perai.service.StudentDictionaryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dictionaries")
@AllArgsConstructor
public class StudentDictionaryController {

    private StudentDictionaryService studentDictionaryService;

    @GetMapping
    public List<StudentDictionary> getAllStudentDictionaryById(@RequestParam Long id) {
        return studentDictionaryService.findAllByStudentId(id);
    }

    @PostMapping
    public ResponseEntity<StudentDictionary> createStudentDictionary(@RequestBody StudentDictionaryRequest request) {
        return new ResponseEntity<>(studentDictionaryService.saveStudentDictionary(request), HttpStatus.CREATED);
    }
}
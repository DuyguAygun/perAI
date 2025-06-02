package com.perai.repository;

import com.perai.model.StudentDictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDictionaryRepository extends JpaRepository<StudentDictionary, Long> {
    Optional<List<StudentDictionary>> findStudentDictionariesByUserId(Long userId);
}
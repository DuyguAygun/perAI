package com.perai.service;

import com.perai.dto.StudentDictionaryRequest;
import com.perai.exception.UserBadRequestException;
import com.perai.exception.UserNotFoundException;
import com.perai.model.StudentDictionary;
import com.perai.model.User;
import com.perai.model.UserRole;
import com.perai.repository.StudentDictionaryRepository;
import com.perai.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentDictionaryService {

    private StudentDictionaryRepository studentDictionaryRepository;
    private UserRepository userRepository;

    public List<StudentDictionary> findAllByStudentId(Long studentId) {
        return studentDictionaryRepository.findStudentDictionariesByUserId(studentId)
                .orElseThrow(() -> new UserNotFoundException("There is no student with this id"));
    }

    public StudentDictionary saveStudentDictionary(StudentDictionaryRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("There is no student with this id"));

        if (!user.getRole().equals(UserRole.STUDENT)) {
            throw new UserBadRequestException("User should be student.");
        }

        StudentDictionary studentDictionary = new StudentDictionary();
        studentDictionary.setWord(request.getWord());
        studentDictionary.setUser(user);
        studentDictionary.setMistakeDescription(request.getMistakeDescription());
        studentDictionary.setTopics(request.getTopicTag());
        studentDictionary.setLearningTag(request.getLearningTag());
        studentDictionary.setErrorTags(request.getErrorTag());
        studentDictionary.setDate(request.getDate());

        return studentDictionaryRepository.save(studentDictionary);
    }
}
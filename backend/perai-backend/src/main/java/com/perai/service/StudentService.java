package com.perai.service;

import com.perai.exception.UserBadRequestException;
import com.perai.exception.UserNotFoundException;
import com.perai.model.User;
import com.perai.model.UserRole;
import com.perai.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentService {

    private UserRepository userRepository;

    public List<User> getStudentsByName(String name, int size) {
        if (size < 1) {
            return List.of();
        }

        return userRepository.findUserByNameContains(name, PageRequest.of(0, size))
                .orElseThrow(() -> new UserNotFoundException("There is no such user"));
    }

    public List<User> getStudentList(User user) {
        boolean isUserPresent = userRepository.findByEmail(user.getEmail()).isPresent();

        if (!isUserPresent)
            throw new UserNotFoundException("There is no such user");

        User teacher = userRepository.findByEmail(user.getEmail()).get();

        if (teacher.getRole().equals(UserRole.STUDENT)) {
            throw new UserBadRequestException("Students can not access to this data");
        }

        return userRepository.findUserByRole(UserRole.STUDENT)
                .orElseThrow(() -> new UserNotFoundException("There is no student"));
    }
}
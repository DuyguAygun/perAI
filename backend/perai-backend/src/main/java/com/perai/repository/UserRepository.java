package com.perai.repository;

import com.perai.model.User;
import com.perai.model.UserRole;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<List<User>> findUserByNameContains(String name, Pageable pageable);

    Optional<List<User>> findUserByRole(UserRole role);
}
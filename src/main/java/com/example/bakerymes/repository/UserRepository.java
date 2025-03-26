package com.example.bakerymes.repository;

import com.example.bakerymes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);

    long countByRole(User.UserRole role);

    List<User> findByRole(User.UserRole userRole);
}
package com.example.bakerymes.service;

import com.example.bakerymes.model.User;
import com.example.bakerymes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 사번 생성
    public String generateEmployeeId() {
        long workerCount = userRepository.countByRole(User.UserRole.WORKER); // 작업자만 카운트
        return String.format("MES%03d", workerCount + 1); // 예: EMP001, EMP002, ...
    }

    private String encodePassword(String rawPassword) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(rawPassword.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 작업자 등록
    public User registerWorker(User user) {
        user.setUserId(generateEmployeeId()); // 사번 자동 생성
        user.setPassword(encodePassword("1234")); // 초기 비밀번호 "1234" 암호화 후 저장
        user.setRole(User.UserRole.WORKER);
        return userRepository.save(user);
    }

    // 로그인 (SHA-256 비밀번호 검증)
    public Optional<User> login(String userId, String password) {
        String encoded = encodePassword(password);
        return userRepository.findByUserId(userId)
                .filter(user -> user.getPassword().equals(encoded));
    }

    // 작업자 목록 가져오기
    public List<User> getAllWorkers() {
        return userRepository.findByRole(User.UserRole.WORKER); // 'WORKER' 역할만 필터링
    }

//    // 관리자 등록
//    public User registerAdmin(User user) {
//        user.setUserId("ADMIN"); // 직접 지정
//        user.setPassword(encodePassword(user.getPassword()));
//        user.setRole(User.UserRole.ADMIN);
//        return userRepository.save(user);
//    }
}

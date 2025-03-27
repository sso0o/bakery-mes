package com.example.bakerymes.controller;

import com.example.bakerymes.model.User;
import com.example.bakerymes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public User registerWorker(@RequestBody User user) {
        return userService.saveWorker(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String password = payload.get("password");
        return userService.login(userId, password)
                .orElseThrow(() -> new RuntimeException("로그인 실패"));
    }

    // 유저 목록 조회 (작업자만 가져오기)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllWorkers(); // 작업자 목록을 반환하는 서비스 메서드
    }

//    @PostMapping("/admin")
//    public User registerAdmin(@RequestBody User user) {
//        return userService.registerAdmin(user);
//    }

}

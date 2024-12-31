package com.fuckgram.controller;
import com.fuckgram.entity.User;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public User createUser(@RequestBody User user){
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}

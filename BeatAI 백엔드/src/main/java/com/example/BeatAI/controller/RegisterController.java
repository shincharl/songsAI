package com.example.BeatAI.controller;

import com.example.BeatAI.dto.SignupRequestDto;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class RegisterController {

    @PostMapping("/signup")
    public ResponseEntity<?> signupMessageSend(
      @RequestBody @Valid SignupRequestDto dto,
      BindingResult bindingResult){

      if (bindingResult.hasErrors()) {
        Map<String, String> errors = new HashMap<>();

        bindingResult.getFieldErrors().forEach(error ->
          errors.put(error.getField(), error.getDefaultMessage())
          );

        return ResponseEntity.badRequest().body(errors);
      }

      return ResponseEntity.ok("회원가입 성공");
    }
}

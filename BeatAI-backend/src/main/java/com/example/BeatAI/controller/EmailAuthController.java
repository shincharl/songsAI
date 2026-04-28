package com.example.BeatAI.controller;

import com.example.BeatAI.dto.EmailRequest;
import com.example.BeatAI.dto.VerifyRequest;
import com.example.BeatAI.service.EmailAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailAuthController {

  private final EmailAuthService emailAuthService;

  @PostMapping("/send")
  public ResponseEntity<?> send(@RequestBody EmailRequest req){
    emailAuthService.sendCode(req.getEmail());
    return ResponseEntity.ok("인증메일 전송");
  }

  @PostMapping("/verify")
  public ResponseEntity<?> verify (@RequestBody VerifyRequest req) {

    if(emailAuthService.verify(req.getEmail(), req.getCode())) {
      return ResponseEntity.ok("인증 성공");
    }


    return ResponseEntity.badRequest().body("인증 실패");
  }
}

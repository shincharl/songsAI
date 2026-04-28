package com.example.BeatAI.service;

import com.example.BeatAI.auth.EmailAuthStore;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

  private final JavaMailSender mailSender;
  private final EmailAuthStore store;

  public boolean verify(String email, String code){
    String saved = store.get(email);
    if(saved != null && saved.equals(code)){
      store.delete(email);
      return true;
    }
    return false;
  }

  public void sendCode(String email){

    String code = String.format("%06d", new Random().nextInt(1000000));

    // 저장 (로컬 : map, 실서버: Redis)
    store.save(email, code);
    
    // 메일 보내기
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(email);
    msg.setSubject("BeatAI 이메일 인증");
    msg.setText("인증번호: " + code);

    mailSender.send(msg);
  }

}

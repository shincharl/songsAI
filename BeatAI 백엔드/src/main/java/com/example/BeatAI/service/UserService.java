package com.example.BeatAI.service;

import com.example.BeatAI.dto.SignupRequestDto;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public void signup(SignupRequestDto dto){
    
    // 아이디 db 중복 체크
    if (userRepository.findByUsername(dto.getUsername()).isPresent()){
        throw new RuntimeException("이미 존재하는 아이디입니다.");
    }

    // 생년월일 변환
    LocalDate birth = null;
    if (dto.getBirth() != null && !dto.getBirth().isBlank()){
      try {
        birth = LocalDate.parse(
          dto.getBirth(),
          DateTimeFormatter.ofPattern("yyyyMMdd")
        );
      }catch (DateTimeParseException e) {
        throw new IllegalArgumentException("존재하지 않는 날짜입니다.");
      }
    }


    // 비밀번호 암호화
    String passwordHash = passwordEncoder.encode(dto.getPassword());

    // 엔티티 생성
    User user = User.builder()
      .username(dto.getUsername())
      .passwordHash(passwordHash)
      .phoneNumber(dto.getPhoneNumber())
      .email(dto.getEmail())
      .carrier(dto.getCarrier())
      .birth(birth)
      .build();

    userRepository.save(user);
  }

}

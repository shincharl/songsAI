package com.example.BeatAI.service;

import com.example.BeatAI.config.JwtUtil;
import com.example.BeatAI.dto.SignupRequestDto;
import com.example.BeatAI.dto.TokenDto;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  // 회원가입
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
  
  // 로그인
  public TokenDto signIn(String username, String rawPassword){
    
    // 1. 사용자 조회
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("아이디가 존재하지 않습니다."));

    // 2. 비밀번호 비교
    if(!passwordEncoder.matches(rawPassword, user.getPasswordHash())){
      throw new RuntimeException("비밀번호가 틀렸습니다.");
    }

    // JWT 생성
    String accessToken = jwtUtil.createAccessToken(user.getUsername());
    String refreshToken = jwtUtil.createRefreshToken(user.getUsername());

    boolean firstLogin = (user.getNickname() == null);

    return TokenDto.builder()
      .accessToken(accessToken)
      .refreshToken(refreshToken)
      .firstLogin(firstLogin)
      .build();
  }

  // AccessToken 재발급
  public TokenDto reissueAccessToken(String refreshToken){
    // 1. JWT 유효성 검증
    if(!jwtUtil.validateToken(refreshToken)) return null;

    // 2. 토큰 타입 확인
    String type = jwtUtil.getType(refreshToken);
    if (!"refresh".equals(type)) return null;
    
    // 3. username 추출
    String username = jwtUtil.getUsername(refreshToken);
    
    // 4. 새 AccessToken 발급
    String newAccessToken = jwtUtil.createAccessToken(username);

    // RefreshToken 그대로 재사용
    return TokenDto.builder()
      .accessToken(newAccessToken)
      .refreshToken(refreshToken)
      .firstLogin(false) // 이미 가입된 유저니까 false
      .build();
  }
  
  // 유저 닉네임 조회
  public boolean isNicknameEmpty(String username){
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
    return user.getNickname() == null || user.getNickname().isBlank();
  }

  // 유저 닉네임 저장
  public User setNickname(String username, String nickname) {

    // 1. 사용자 조회
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 2. 닉네임 설정
    user.setFirstNickname(nickname);

    // 3. DB 저장
    return userRepository.save(user);
  }

  public String getNickname(String username) {

    // 1. DB에서 유저 조회
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 닉네임 반환
    return user.getNickname();
  }
}

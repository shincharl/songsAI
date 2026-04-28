package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class SignupVerification {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;

  private String phoneNumber;

  private String carrier;

  private String code; // 인증번호

  private LocalDateTime expireAt;

  private boolean verified;

  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist(){
    this.createdAt = LocalDateTime.now();
  }
}

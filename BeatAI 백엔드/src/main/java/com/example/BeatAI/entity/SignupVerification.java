package com.example.BeatAI.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class SignupVerification {

  @Id @GeneratedValue
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

package com.example.BeatAI.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Table(name = "users")
public class User {

  @Id @GeneratedValue
  @Column(name = "USER_ID")
  private Long id;

  @Column(unique = true, nullable = false, length = 50)
  private String username;

  @Column(nullable = false, length = 255)
  private String passwordHash;

  @Column(length = 20)
  private String carrier;

  @Column(length = 20, unique = true)
  private String phoneNumber;

  @Column(length = 100)
  private String email;

  @Column(length = 100)
  private LocalDate birth;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Diary> diaries = new ArrayList<>();

  @PrePersist
  public void prePersist(){
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void preUpdate(){
    this.updatedAt = LocalDateTime.now();
  }

  @Builder
  public User(String username, String passwordHash,
              String phoneNumber, String email,
              String carrier, LocalDate birth) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.carrier = carrier;
    this.birth = birth;
  }


}

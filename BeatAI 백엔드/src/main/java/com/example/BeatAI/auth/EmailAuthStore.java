package com.example.BeatAI.auth;

public interface EmailAuthStore {

  void save(String email, String code);

  String get(String email);

  void delete(String email);
}

package com.example.BeatAI.auth;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Profile("local")
public class MapEmailAuthStore implements EmailAuthStore {

  private Map<String, EmailAuth> map = new ConcurrentHashMap<>();


  @Override
  public void save(String email, String code) {
    long expiresAt = System.currentTimeMillis() + (3 * 60 * 1000); // 3분
    map.put(email, new EmailAuth(code, expiresAt));
  }

  @Override
  public String get(String email) {
    EmailAuth auth = map.get(email);

    if (auth == null) return null;
    
    // 만료 체크
    if (auth.expiresAt < System.currentTimeMillis()) {
      map.remove(email);
      return null;
    }

    return auth.code;
  }

  @Override
  public void delete(String email) {
    map.remove(email);
  }

  private static class EmailAuth {
    String code;
    long expiresAt; // 만료시간(ms)

    public EmailAuth(String code, long expiresAt) {
      this.code = code;
      this.expiresAt = expiresAt;
    }
  }
}

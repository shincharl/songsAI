package com.example.BeatAI.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Profile("prod") // 나중에 prod(실서버)에서만 사용
@RequiredArgsConstructor
public class RedisEmailAuthStore implements EmailAuthStore{

  private final RedisTemplate<String, String> redisTemplate;


  @Override
  public void save(String email, String code) {
      redisTemplate.opsForValue()
        .set("email" + email, code, 5, TimeUnit.MINUTES);
  }

  @Override
  public String get(String email) {
    return redisTemplate.opsForValue().get("email:" + email);
  }

  @Override
  public void delete(String email) {
      redisTemplate.delete("email" + email);
  }
}

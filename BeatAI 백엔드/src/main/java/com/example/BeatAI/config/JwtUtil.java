package com.example.BeatAI.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

  private final String SECRET = "BeatAI-secret-key-123456";

  public String generateToken(String username){
    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
      .signWith(SignatureAlgorithm.ES256, SECRET)
      .compact();

  }

}

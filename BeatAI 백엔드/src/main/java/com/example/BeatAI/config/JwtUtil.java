package com.example.BeatAI.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  private final String SECRET = "BeatAI-secret-key-12345678901234567890";
  private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

  private final long ACCESS_EXPIRE = 1000 * 60 * 60; // 1시간
  private final long REFRESH_EXPIRE = 1000L * 60 * 60 * 24 * 7; // 7일

  // AccessToken 생성
  public String createAccessToken(String username){
    return Jwts.builder()
      .setSubject(username)
      .claim("type", "access")
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRE))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  // RefreshToken
  public String createRefreshToken(String username) {
    return Jwts.builder()
      .setSubject(username)
      .claim("type", "refresh")
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRE))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }
  
  // username 추출
  public String getUsername(String token){
    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }
  
  // 토큰 검증
  public boolean validateToken(String token){
    try {
      Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token);
      return true;
    }catch(Exception e){
      return false;
    }
  }
  
  // 토큰 타입 추출
  public String getType(String token){
    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .get("type", String.class);
  }

}

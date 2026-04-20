package com.example.BeatAI.config;

import com.example.BeatAI.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())

      // h2-console iframe 허용
      .headers(headers -> headers.frameOptions(frame -> frame.disable()))
      
      // h2-console 접근 허용
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/h2-console/**").permitAll()

        // 커뮤니티 조회는 공개
        .requestMatchers(HttpMethod.GET, "/api/community/posts").permitAll()

        // 커뮤니티 작성/리액션은 로그인 필요
        .requestMatchers(HttpMethod.POST, "/api/community/posts").authenticated()
        .requestMatchers(HttpMethod.POST, "/api/community/posts/*/reactions").authenticated()

        .anyRequest().permitAll()
      );
    
    // JWT 필터 등록
    http.addFilterBefore(
      new JwtAuthenticationFilter(jwtUtil, userRepository),
      UsernamePasswordAuthenticationFilter.class
    );

    return http.build();
  }

  /* 비밀번호 암호화 */
  @Bean
  public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
  }

}

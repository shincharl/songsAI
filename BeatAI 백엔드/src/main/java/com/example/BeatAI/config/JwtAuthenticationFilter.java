package com.example.BeatAI.config;

import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  // JWT 검증 유틸 클래스
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
    throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    if(authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      if(jwtUtil.validateToken(token)){
        String username = jwtUtil.getUsername(token);

        // DB에서 User 조회
        User user = userRepository.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("User not found"));

        // UserPrincipal 생성
        UserPrincipal userPrincipal = new UserPrincipal(user);

        // SecurityContext에 인증 정보 넣기
        UsernamePasswordAuthenticationToken auth =
          new UsernamePasswordAuthenticationToken(
            userPrincipal, null, userPrincipal.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    }

    filterChain.doFilter(request, response);
  }
}

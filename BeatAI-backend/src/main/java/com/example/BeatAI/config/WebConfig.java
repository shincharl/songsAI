// 프런트, 백엔드 CORS 전역 연결 설정

package com.example.BeatAI.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final CorsProperties corsProperties;

  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
      .allowedOrigins(corsProperties.getAllowedOrigins().toArray(new String[0]))
      .allowedMethods("*")
      .allowedHeaders("*")
      .allowCredentials(true);

  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/profile/**")
      .addResourceLocations("file:" + uploadDir + "/");
  }

}

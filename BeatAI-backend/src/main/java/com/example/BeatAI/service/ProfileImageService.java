package com.example.BeatAI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ProfileImageService {

  @Value("${file.upload-dir}")
  private String uploadDir;

  public String save(MultipartFile file){
    validate(file);

    try {
      String extension = getExtension(file);
      String savedFilename = UUID.randomUUID() + extension;

      Path uploadPath = Path.of(uploadDir);

      if(!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      Path savePath = uploadPath.resolve(savedFilename);

      file.transferTo(savePath.toFile());

      return "/uploads/profile/" + savedFilename;

    }catch (IOException e) {
      throw new RuntimeException("프로필 이미지 저장에 실패했습니다.", e);
    }
  }

  private void validate(MultipartFile file){
    if (file == null || file.isEmpty()){
      throw new IllegalArgumentException("이미지 파일이 없습니다.");
    }

    if (file.getSize() > 5 * 1024 * 1024){
      throw new IllegalArgumentException("이미지는 최대 5MB까지 업로드할 수 있습니다.");
    }

    String contentType = file.getContentType();

    if(contentType == null || !contentType.startsWith("image/")){
      throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
    }

    if(!contentType.equals("image/jpeg") && !contentType.equals("image/png")){
      throw new IllegalArgumentException("JPG, PNG 이미지만 업로드할 수 있습니다.");
    }
  }

  private String getExtension(MultipartFile file){
    String contentType = file.getContentType();

    return switch (contentType) {
      case "image/jpeg" -> ".jpg";
      case "image/png" -> ".png";
      default -> throw new IllegalArgumentException("지원하지 않는 이미지 형식입니다.");
    };
  }
}

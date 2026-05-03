package com.example.BeatAI.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileImageService {

  private final S3Client s3Client;

  @Value("${aws.s3.bucket}")
  private String bucket;

  @Value("${aws.s3.region}")
  private String region;

  public String save(MultipartFile file){
    validate(file);

    try {
      String extension = getExtension(file);
      String savedFilename = UUID.randomUUID() + extension;

      String key = "profile/" + savedFilename;

      PutObjectRequest request = PutObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .contentType(file.getContentType())
        .build();

      s3Client.putObject(
        request,
        RequestBody.fromBytes(file.getBytes())
      );

      return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;

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

  public void delete(String imageUrl){
    if(imageUrl == null || imageUrl.isBlank()) return;

    String marker = ".amazonaws.com/";
    int index = imageUrl.indexOf(marker);

    if(index == -1) return;

    String key = imageUrl.substring(index + marker.length());

    DeleteObjectRequest request = DeleteObjectRequest.builder()
      .bucket(bucket)
      .key(key)
      .build();

    s3Client.deleteObject(request);
  }
}

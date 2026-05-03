package com.example.BeatAI.service;

import com.example.BeatAI.dto.MyProfileResponse;
import com.example.BeatAI.dto.UpdateMyProfileRequest;
import com.example.BeatAI.entity.User;
import com.example.BeatAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserprofileService {

  private final UserRepository userRepository;
  private final ProfileImageService profileImageService;

  // 내 정보 조회
  public MyProfileResponse getMyProfile(Long userId){
    User user = getUser(userId);
    return toResponse(user);
  }

  // 닉네임 수정
  @Transactional
  public MyProfileResponse updateMyProfile(
    Long userId,
    UpdateMyProfileRequest request
  ){
    User user = getUser(userId);

    if(request.nickname() == null || request.nickname().trim().isEmpty()){
      throw new IllegalArgumentException("닉네임을 입력해주세요.");
    }

    user.updateNickname(request.nickname().trim());

    return toResponse(user);
  }
  
  // 프로필 이미지 업로드
  @Transactional
  public MyProfileResponse uploadProfileImage(Long userId, MultipartFile file){
    User user = getUser(userId);

    String imageUrl = profileImageService.save(file);

    user.updateProfileImageUrl(imageUrl);

    return toResponse(user);
  }

  // 프로필 이미지 삭제
  @Transactional
  public MyProfileResponse deleteProfileImage(Long userId){
    User user = getUser(userId);

    user.updateProfileImageUrl(null);

    return toResponse(user);
  }

  // 회원 탈퇴
  @Transactional
  public void deleteMyAccount(Long userId){
    User user = getUser(userId);
    userRepository.delete(user);
  }

  // 공통 유저 조회
  private User getUser(Long userId){
    return userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
  }
  
  // DTO 변환
  private MyProfileResponse toResponse(User user){
    return new MyProfileResponse(
      user.getId(),
      user.getEmail(),
      user.getNickname(),
      user.getProfileImageUrl()
    );
  }
}

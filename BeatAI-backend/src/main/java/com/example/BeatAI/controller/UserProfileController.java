package com.example.BeatAI.controller;

import com.example.BeatAI.config.UserPrincipal;
import com.example.BeatAI.dto.MyProfileResponse;
import com.example.BeatAI.dto.UpdateMyProfileRequest;
import com.example.BeatAI.service.UserprofileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserProfileController {

  private final UserprofileService userprofileService;

  @GetMapping("/me")
  public MyProfileResponse getMyProfile(
    @AuthenticationPrincipal UserPrincipal principal
    ){
    return userprofileService.getMyProfile(principal.getId());
  }

  @PatchMapping("/me")
  public MyProfileResponse updateMyProfile(
    @AuthenticationPrincipal UserPrincipal principal,
    @RequestBody UpdateMyProfileRequest request
    ){
    return userprofileService.updateMyProfile(principal.getId(), request);
  }

  @PostMapping(
    value = "/me/profile-image",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public MyProfileResponse uploadProfileImage(
    @AuthenticationPrincipal UserPrincipal principal,
    @RequestPart("file")MultipartFile file
    ){
    return userprofileService.uploadProfileImage(principal.getId(), file);
  }

  @DeleteMapping("/me/profile-image")
  public MyProfileResponse deleteProfileImage(
    @AuthenticationPrincipal UserPrincipal principal
  ){
    return userprofileService.deleteProfileImage(principal.getId());
  }

  @DeleteMapping("/me")
  public void deleteMyAccount(
    @AuthenticationPrincipal UserPrincipal principal
  ){
    userprofileService.deleteMyAccount(principal.getId());
  }

}

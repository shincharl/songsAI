package com.example.BeatAI.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {

  @NotBlank(message = "아이디는 필수입니다.")
  @Size(min = 4, max = 15, message = "아이디는 4~15자")
  @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문, 숫자, _만 가능합니다.")
  private String username;

  @NotBlank(message = "비밀번호는 필수입니다.")
  @Size(min = 8, max = 20, message = "비밀번호는 8~20자")
  @Pattern(
    regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&]).+$",
    message = "비밀번호는 영문+숫자+특수문자 포함해야 합니다."
  )
  private String password;

  @Email(message = "이메일 형식이 아닙니다.")
  @NotBlank(message = "이메일은 필수입니다.")
  private String email;

  @Pattern(regexp = "^\\d{8}$", message = "생년월일은 YYYYMMDD 형식")
  private String birth;

  @Pattern(regexp = "010-\\d{4}-\\d{4}", message = "전화번호 형식이 잘못되었습니다.")
  private String phoneNumber;

  @NotNull
  private String carrier;

}

/*
* {
  "username": "test@beatai.com",
  "password": "1234",
  "email": "test@gmail.com",
  "birth": "19990101",
  "phoneNumber": "01012345678",
  "carrier": "SKT"
}
* */

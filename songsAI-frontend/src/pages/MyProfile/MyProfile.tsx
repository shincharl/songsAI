import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  deleteProfileImage,
  deleteMyAccount,
} from "../../api/user";
import styles from "../../styles/MyProfile.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState("사용자");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const setAuthNickname = useAuthStore((state) => state.setNickname);
  const setProfileImageStore = useAuthStore((state) => state.setProfileImageUrl);

  const getImageUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_FILE_BASE_URL || ""}${url}`;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("JPG, PNG 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("이미지 용량이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      const data = await uploadProfileImage(file);

      const imageUrl = getImageUrl(data.profileImageUrl);

      setProfileImage(imageUrl);
      setProfileImageStore(data.profileImageUrl);

    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 413) {
          alert("이미지 용량이 너무 큽니다.");
          return;
        }

        if (status === 400) {
          alert("업로드할 수 없는 이미지 형식입니다.");
          return;
        }

        alert("이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      alert("알 수 없는 오류가 발생했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfileImage();

      setProfileImage(undefined);
      setProfileImageStore(null);

      alert("프로필 이미지가 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      alert("프로필 이미지 삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const data = await updateMyProfile({ nickname });

      setNickname(data.nickname);
      setAuthNickname(data.nickname);

      alert("프로필 정보가 저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("프로필 정보 저장에 실패했습니다.");
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "정말 회원 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
    );

    if (!confirmed) return;

    try {
      await deleteMyAccount();

      useAuthStore.getState().logout();

      alert("회원 탈퇴 완료");
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("회원 탈퇴에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        setNickname(data.nickname);
        setAuthNickname(data.nickname);

        setEmail(data.email);

        setProfileImage(getImageUrl(data.profileImageUrl));
        setProfileImageStore(data.profileImageUrl);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProfile();
  }, [setAuthNickname, setProfileImageStore]);

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <h1>내 정보</h1>
        <p>회원 정보를 관리하고 계정 설정을 변경할 수 있습니다.</p>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <h2>프로필 이미지</h2>
        </div>

        <div className={styles.profileBox}>
          <div className={styles.avatarWrap}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필 이미지"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.defaultAvatar}>🎧</div>
            )}

            <button
              type="button"
              className={styles.cameraButton}
              onClick={handleImageClick}
            >
              📷
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              className={styles.hiddenInput}
              onChange={handleImageChange}
            />
          </div>

          <div className={styles.profileText}>
            <h3>프로필 이미지를 설정해보세요.</h3>
            <p>JPG, PNG 파일 / 최대 5MB</p>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.primaryOutlineButton}
                onClick={handleImageClick}
              >
                이미지 변경
              </button>

              <button
                type="button"
                className={styles.grayButton}
                onClick={handleDeleteImage}
              >
                이미지 삭제
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <h2>기본 정보</h2>
        </div>

        <div className={styles.formRow}>
          <label>이메일</label>
          <div className={styles.emailText}>{email}</div>
          <span className={styles.badge}>수정 불가</span>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="nickname">닉네임</label>

          <div className={styles.inputArea}>
            <input
              id="nickname"
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
            />
            <span>{nickname.length} / 20</span>
          </div>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            저장하기
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <h2>계정 관리</h2>
        </div>

        <div className={styles.accountRow}>
          <div className={styles.accountInfo}>
            <div className={styles.iconCircle}>↪</div>
            <div>
              <h3>로그아웃</h3>
              <p>현재 계정에서 로그아웃합니다.</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.grayButton}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>

        <div className={styles.accountRow}>
          <div className={styles.accountInfo}>
            <div className={styles.warningCircle}>!</div>
            <div>
              <h3>회원 탈퇴</h3>
              <p>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.dangerButton}
            onClick={handleDeleteAccount}
          >
            회원 탈퇴
          </button>
        </div>
      </section>

      <section className={styles.notice}>
        <strong>개인정보 보호</strong>
        <p>
          회원님의 개인정보는 안전하게 보호되며, 서비스 제공 목적 외에는
          사용되지 않습니다.
        </p>
      </section>
    </main>
  );
};

export default MyProfile;
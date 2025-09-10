import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import {
  uploadBackgroundImage,
  uploadProfileImage,
  uploadCertificateImage,
  uploadProductImage,
} from "../api/imgApi";

const Container = styled.div`
  width: 100%;
  margin: 1rem auto;
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
`;

const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed ${({ isDragging }) => (isDragging ? "#3b82f6" : "#d1d5db")};
  cursor: pointer;
  background-color: ${({ isDragging }) => (isDragging ? "#eff6ff" : "#f9fafb")};
  color: #6b7280;
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #333;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
`;

const Controls = styled.div`
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #6b7280;
  color: white;
  &:hover {
    background-color: #4b5563;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #555;
`;

const ImageHelperText = styled.p`
  padding: 1rem;
`;

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const ImageUploader = ({ aspectRatio, onUploadComplete, type }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!aspectRatio) {
      handleDirectUpload(file);
      return;
    }
    let imageDataUrl = await readFile(file);
    setImageSrc(imageDataUrl);
    setCroppedImage(null);
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDirectUpload = async (file) => {
    setIsUploading(true);
    try {
      const finalImgUrl = await uploadCertificateImage(file);
      onUploadComplete(finalImgUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropAndUpload = useCallback(async () => {
    setIsUploading(true);
    try {
      if (!croppedAreaPixels) {
        throw new Error("자르기 영역이 설정되지 않았습니다.");
      }

      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const croppedImageFile = new File(
        [croppedImageBlob],
        `cropped-image-${Date.now()}.jpeg`,
        {
          type: "image/jpeg",
        }
      );

      if (croppedImageFile.size < 100) {
        throw new Error("잘라낸 이미지 파일이 너무 작거나 손상되었습니다.");
      }
      if (type === "background") {
        const finalImgUrl = await uploadBackgroundImage(croppedImageFile);
        onUploadComplete(finalImgUrl);
        reset();
      }
      if (type === "profile") {
        const finalImgUrl = await uploadProfileImage(croppedImageFile);
        onUploadComplete(finalImgUrl);
        reset();
      }
      if (type === "bizImg") {
        const finalImgUrl = await uploadCertificateImage(croppedImageFile);
        onUploadComplete(finalImgUrl);
        reset();
      }
      if (type === "productImg") {
        const finalImgUrl = await uploadProductImage(croppedImageFile);
        onUploadComplete(finalImgUrl);
        reset();
      }
      reset();
    } catch (e) {
      console.error("이미지 처리 또는 업로드 중 오류 발생:", e);
      alert(e.message || "이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  }, [imageSrc, croppedAreaPixels, onUploadComplete]);

  const reset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const renderContent = () => {
    if (isUploading) {
      return <LoadingSpinner>업로드 중...</LoadingSpinner>;
    }

    if (imageSrc && aspectRatio) {
      return (
        <>
          <Controls>
            <PrimaryButton onClick={handleCropAndUpload}>
              적용하기
            </PrimaryButton>
            <SecondaryButton onClick={reset}>취소</SecondaryButton>
          </Controls>
          <CropperContainer>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </CropperContainer>
        </>
      );
    }

    return (
      <DropZone
        onClick={() => inputRef.current.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        isDragging={isDragging}
      >
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <ImageHelperText>
          이미지를 올리시거나 클릭해서 업로드 해주세요
        </ImageHelperText>
      </DropZone>
    );
  };

  return <Container>{renderContent()}</Container>;
};

export default ImageUploader;

export const validateStep = (step, formData) => {
  const newErrors = {};
  switch (step) {
    case 1:
      if (!formData.storeName.trim())
        newErrors.storeName = "가게 이름을 입력해주세요.";
      if (!formData.description.trim())
        newErrors.description = "가게 설명을 입력해주세요.";
      break;
    case 2:
      if (!formData.bizOwnerName.trim())
        newErrors.bizOwnerName = "사업자 이름을 입력해주세요.";
      if (!formData.bizNo.trim())
        newErrors.bizNo = "사업자 등록번호를 입력해주세요.";
      if (!formData.bizImg)
        newErrors.bizImg = "사업자 등록증을 첨부해주세요.";
      break;
    case 3:
      if (!formData.contactNo.trim())
        newErrors.contactNo = "연락처를 입력해주세요.";
      if (!formData.workingHour.trim())
        newErrors.workingHour = "영업 시간을 입력해주세요.";
      if (!formData.storeAddress.trim())
        newErrors.storeAddress = "가게 주소를 입력해주세요.";
      break;
    default:
      break;
  }
  return newErrors;
};

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerStore, resetRegisterStatus } from "../redux/slices/storeSlice";
import { validateStep } from "../utils/validation";

const useCreateStoreForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.store);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    storeTag: "",
    backImg: null,
    profileImg: null,
    bizOwnerName: "",
    bizNo: "",
    bizImg: null,
    contactNo: "",
    workingHour: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const resetImage = (type) => {
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, backImg: file }));
  };

  const handleProfileImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, profileImg: file }));
  };

  const handleBizImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, bizImg: file }));
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => ({ ...prev, ...address }));
  };

  const handleStepClick = (step) => {
    if (step === currentStep) return;

    if (step < currentStep) {
      setErrors({});
      setCurrentStep(step);
      return;
    }

    for (let i = 1; i < step; i++) {
      const stepErrors = validateStep(i, formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setCurrentStep(i);
        return;
      }
    }

    setErrors({});
    setCurrentStep(step);
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const step1Errors = validateStep(1, formData);
    const step2Errors = validateStep(2, formData);
    const step3Errors = validateStep(3, formData);

    if (
      Object.keys(step1Errors).length === 0 &&
      Object.keys(step2Errors).length === 0 &&
      Object.keys(step3Errors).length === 0
    ) {
      dispatch(registerStore(formData));
    } else {
      setErrors({ ...step1Errors, ...step2Errors, ...step3Errors });
    }
  };

  const handleFinish = () => {
    dispatch(resetRegisterStatus());
    navigate("/my-store");
  };

  return {
    currentStep,
    formData,
    errors,
    success,
    handleChange,
    resetImage,
    handleImageUpload,
    handleProfileImageUpload,
    handleBizImageUpload,
    handleAddressSelect,
    handleStepClick,
    handleNext,
    handlePrev,
    handleSubmit,
    handleFinish,
  };
};

export default useCreateStoreForm;

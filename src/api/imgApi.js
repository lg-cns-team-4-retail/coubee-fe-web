import apiClient from "./index";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const uploadProfileImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  try {
    const response = await apiClient.post(
      "/store/admin/img/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadBackgroundImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  try {
    const response = await apiClient.post(
      "/store/admin/img/background",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadCertificateImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  try {
    const response = await apiClient.post(
      "/store/admin/img/certificate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  try {
    const response = await apiClient.post(
      "/product/admin/img/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

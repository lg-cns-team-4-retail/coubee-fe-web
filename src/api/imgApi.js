import apiClient from "./index";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const uploadProfileImage = async (file) => {
  console.log(file);
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

    console.log("Image upload success:", response.data);
    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    console.log(finalUrl);
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadBackgroundImage = async (file) => {
  console.log(file);

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

    console.log("Image upload success:", response.data);
    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    console.log(finalUrl);
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadCertificateImage = async (file) => {
  console.log(file);

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

    console.log("Image upload success:", response.data);
    const finalUrl = API_BASE_URL + "/store" + response.data.data;
    console.log(finalUrl);
    return response.data.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

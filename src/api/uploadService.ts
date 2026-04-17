import axiosInstance from "@/utils/axios";

export const uploadLogo = async (logoFile: File) => {
  const formData = new FormData();
  formData.append("logo", logoFile);

  const response = await axiosInstance.post("/upload/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

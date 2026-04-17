import axiosInstance from "@/utils/axios";

export const search = async (query: string, type?: string) => {
  const response = await axiosInstance.get("/search", {
    params: {
      query,
      ...(type && { type }),
    },
  });
  return response.data;
};

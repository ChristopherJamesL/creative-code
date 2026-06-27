import apiClient from "../../../api/axios";

export const httpLogin = async () => {
  const response = await apiClient.get("/auth/login");
  console.log("response: ", response);

  return response.data.data;
};

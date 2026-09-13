import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const getAIRecommendations = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/ai/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
import axios from "axios";

const API_URL = "https://eventopia-backend-1tzq.onrender.com/api/v1";

export const getAIRecommendations = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/ai/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
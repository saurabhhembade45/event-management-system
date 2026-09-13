import api from "./index";

export const getAIRecommendations = () => {
  return api.get("/ai/recommendations");
};
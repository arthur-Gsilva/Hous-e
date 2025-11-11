import api from "./api";

export const getProfile = async () => {
    try {
    const res = await api.get("/user/profile");
    return res.data.user;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error; 
  }
    
}

export const logout = async () => {
    const res = await api.post("user/logout");
    return res.data;
}

export const getRecommendations = async () => {
    const res = await api.get('user/recommendations')
    console.log(res.data.recommendations)
    return res.data.recommendations
}
import api from "./api";

export const getProfile = async () => {
    const res = await api.get("user/profile");
    return res.data;
}

export const logout = async () => {
    const res = await api.post("user/logout");
    return res.data;
}


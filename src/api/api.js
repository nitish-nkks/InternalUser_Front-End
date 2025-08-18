import axiosInstance from "./axiosInstance";

export const loginUser = (email, password, guestId = null) => {
    return axiosInstance.post("/auth/login", {
        email,
        password,
        guestId
    });
};

export const getInternalUserDetails = (userId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        return Promise.reject(new Error("No auth token found"));
    }
    return axiosInstance.get(`/InternalUser/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
import axiosInstance from "./axiosInstance";

const BASE_URL = "http://localhost:5207/api";

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

export const addProduct = async (productData) => {
    try {
        const response = await axiosInstance.post(`/Products`, productData);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

export const getCategoryTree = async () => {
  return axiosInstance.get("/Categories/tree");
};

export const uploadProductImage = async (productId, file, isPrimary = false) => {
  const formData = new FormData();
  formData.append("ProductId", productId);
  formData.append("Image", file);
  formData.append("IsPrimary", isPrimary);

  try {
    const response = await axiosInstance.post("/ProductImages/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

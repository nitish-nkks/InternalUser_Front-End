import axiosInstance from "./axiosInstance";
import axios from "axios";

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

export const addCategory = async (data) => {
  try {
    const response = await axiosInstance.post("/Categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createFlashSale = async (flashSaleData) => {
  try {
    const response = await axiosInstance.post("/FlashSale", flashSaleData);
    return response.data;
  } catch (error) {
    console.error("Error creating flash sale:", error);
    throw error.response?.data || error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/Products/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || error;
  }
};

export const getAllProductsFiltered = async (filter = {}) => {
  try {
    const response = await axiosInstance.get('/Products', {
      params: {
        Page: filter.page || 1,
        PageSize: filter.pageSize || 10,
        Descending: filter.descending || false
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/Products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error.response?.data || error;
  }
};
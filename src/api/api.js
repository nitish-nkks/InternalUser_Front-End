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

export const getCategory = async (id) => {
  try {
    const response = await axiosInstance.get(`/Categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error.response?.data || error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/Categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error.response?.data || error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/Categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error.response?.data || error;
  }
};

export const getAllInternalUsers = async () => {
  try {
    const response = await axiosInstance.get("/InternalUser");
    return response.data;
  } catch (error) {
    console.error('Error fetching internal users:', error);
    throw error.response?.data || error;
  }
};

export const createInternalUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/InternalUser/create", userData);
    return response.data;
  } catch (error) {
    console.error('Error creating internal user:', error);
    throw error.response?.data || error;
  }
};

export const updateInternalUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/InternalUser/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating internal user:', error);
    throw error.response?.data || error;
  }
};

export const deleteInternalUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/InternalUser/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting internal user:', error);
    throw error.response?.data || error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/Order");
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/Order/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(`/Order/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error.response?.data || error;
  }
};

// Flash sale
export const createFlashSale = async (flashSaleData) => {
  try {
    const response = await axiosInstance.post("/FlashSale", flashSaleData);
    return response.data;
  } catch (error) {
    console.error("Error creating flash sale:", error);
    throw error.response?.data || error;
  }
};

export const getFlashSales = async () => {
  try {
    const response = await axiosInstance.get("/FlashSale/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    throw error.response?.data || error;
  }
};

export const updateFlashSale = async (saleData) => {
  try {
    const response = await axiosInstance.put(`/FlashSale/${saleData.id}`, saleData);
    return response.data;
  } catch (error) {
    console.error("Error updating flash sale:", error);
    throw error.response?.data || error;
  }
};


export const deleteFlashSale = async (id) => {
  try {
    const response = await axiosInstance.delete(`/FlashSale/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    throw error.response?.data || error;
  }
};
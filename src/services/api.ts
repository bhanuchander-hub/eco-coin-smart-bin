// API Configuration
// IMPORTANT: Update this URL to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('smartbin_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('smartbin_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('smartbin_token');
};

// Generic API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth API
export const authApi = {
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await apiRequest<{
      token: string;
      user: any;
      message: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    setToken(response.token);
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest<{
      token: string;
      user: any;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setToken(response.token);
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
      localStorage.removeItem('smartbin_user');
    }
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },

  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  getToken,
  setToken,
  removeToken,
};

// Profile API
export const profileApi = {
  get: async () => {
    return apiRequest<{ profile: any }>('/profile');
  },

  update: async (profileData: {
    full_name?: string;
    phone?: string;
    address?: string;
    username?: string;
    profile_image_url?: string;
    bio?: string;
    email?: string;
  }) => {
    return apiRequest<{ profile: any; message: string }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  updateStats: async (stats: {
    coins?: number;
    recycled_weight?: number;
    eco_points?: number;
  }) => {
    return apiRequest<{ profile: any; message: string }>('/profile/stats', {
      method: 'PUT',
      body: JSON.stringify(stats),
    });
  },

  updateImage: async (imageUrl: string) => {
    return apiRequest<{ profile: any; message: string }>('/profile/image', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl }),
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    return apiRequest<{ orders: any[] }>('/orders');
  },

  getById: async (id: string) => {
    return apiRequest<{ order: any }>(`/orders/${id}`);
  },

  create: async (orderData: {
    pickup_address?: string;
    latitude?: number;
    longitude?: number;
    estimated_weight?: number;
    special_instructions?: string;
    product_id?: string;
    product_name?: string;
    quantity?: number;
    size?: string;
    coins_spent?: number;
  }) => {
    return apiRequest<{ order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  update: async (id: string, status: string) => {
    return apiRequest<{ order: any; message: string }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string) => {
    return apiRequest<{ order: any; message: string }>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Waste Uploads API
export const wasteUploadsApi = {
  getAll: async () => {
    return apiRequest<{ uploads: any[] }>('/waste-uploads');
  },

  create: async (uploadData: {
    image_url: string;
    image_path?: string;
    gemini_analysis?: any;
    waste_type?: string;
    classification?: string;
    weight_grams?: number;
    pickup_location_lat?: number;
    pickup_location_lng?: number;
    pickup_address?: string;
  }) => {
    return apiRequest<{ upload: any; coins_earned: number; message: string }>('/waste-uploads', {
      method: 'POST',
      body: JSON.stringify(uploadData),
    });
  },

  getStats: async () => {
    return apiRequest<{ stats: any }>('/waste-uploads/stats');
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: { category?: string; search?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiRequest<{ products: any[] }>(`/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ product: any }>(`/products/${id}`);
  },

  seed: async () => {
    return apiRequest<{ message: string; count: number }>('/products/seed', {
      method: 'POST',
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest<{ status: string; message: string }>('/health');
};

export default {
  auth: authApi,
  profile: profileApi,
  orders: ordersApi,
  wasteUploads: wasteUploadsApi,
  products: productsApi,
  healthCheck,
};

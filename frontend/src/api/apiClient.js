/**
 * apiClient.js
 * 
 * Cliente HTTP centralizado. Todas las llamadas al backend pasan por aquí.
 * Si cambias la URL base del API (ej: de localhost a producción), 
 * solo cambias aquí.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("cs_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("cs_token", token);
    } else {
      localStorage.removeItem("cs_token");
    }
  }

  getToken() {
    return this.token || localStorage.getItem("cs_token");
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || data.errors?.[0]?.msg || "Error del servidor");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient();
export default api;

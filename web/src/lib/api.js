const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: "An error occurred" }));
        throw new Error(error.detail || "Request failed");
      }

      // Handle empty responses (like DELETE)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async signup(userData) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getMe() {
    return this.request("/api/auth/me");
  }

  // Clipboard endpoints
  async getClipboardItems() {
    return this.request("/api/clipboard");
  }

  async createClipboardItem(content) {
    return this.request("/api/clipboard", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async getClipboardItem(itemId) {
    return this.request(`/api/clipboard/${itemId}`);
  }

  async updateClipboardItem(itemId, content) {
    return this.request(`/api/clipboard/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async deleteClipboardItem(itemId) {
    return this.request(`/api/clipboard/${itemId}`, {
      method: "DELETE",
    });
  }

  // Share endpoints
  async shareClipboardItem(itemId) {
    return this.request(`/api/clipboard/${itemId}/share`, {
      method: "POST",
    });
  }

  async unshareClipboardItem(itemId) {
    return this.request(`/api/clipboard/${itemId}/share`, {
      method: "DELETE",
    });
  }

  async validateShareCode(code) {
    return this.request("/api/share/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }
}

export const api = new ApiClient();
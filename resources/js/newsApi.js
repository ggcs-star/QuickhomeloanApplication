const BASE_URL = "https://news.quickhomeloan.in/api";

/* ---------- COMMON FETCH WRAPPER ---------- */
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

/* ---------- NEWS API METHODS ---------- */
const newsApi = {
  getCategories: () => request("/category"),
  getPosts: () => request("/posts"),
  getPostDetails: (slug) => request(`/details?slug=${slug}`),
};

export default newsApi;
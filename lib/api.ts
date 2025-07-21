import type { LoginCredentials, RegisterData, User } from "@/types/auth"

/* ------------------------------------------------------------------ */
/*  Generic fetch wrapper                                             */
/* ------------------------------------------------------------------ */

// In the browser we always call the same-origin `/api` routes.
// On the server we can still honour NEXT_PUBLIC_API_BASE_URL if you need it.
const API_BASE_URL =
  typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api" : "/api";

class APIClient {
  constructor(private baseURL: string) {}

  private async request<T>(endpoint: string, opts: RequestInit = {}): Promise<T> {
    // Always use full backend URL for browser fetches
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Debug log for all API requests
    if (endpoint === "/loyalty/user") {
      console.log("[DEBUG] Fetching /api/loyalty/user with token:", token)
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    }
    
    console.log("📋 Request headers:", headers)

    const res = await fetch(url, {
      // Default headers
      headers,
      ...opts,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Request failed: ${res.status}`)
    }

    return res.json()
  }

  get<T>(e: string, o: RequestInit = {}): Promise<T> {
    return this.request<T>(e, { method: "GET", ...o })
  }

  post<T>(e: string, d?: any, o: RequestInit = {}): Promise<T> {
    return this.request<T>(e, { method: "POST", body: d ? JSON.stringify(d) : undefined, ...o })
  }
}

const api = new APIClient(API_BASE_URL)

/* ------------------------------------------------------------------ */
/*  AUTH API                                                          */
/* ------------------------------------------------------------------ */

export const authAPI = {
  login: (c: LoginCredentials) => api.post<BackendLoginResponse>("/auth/login", c),
  register: (d: RegisterData) => api.post<any>("/auth/register", d),
  getProfile: () => api.get<User>("/auth/profile"),
  updateProfile: (d: Partial<User>) => api.post<User>("/auth/profile", d),
  logout: () => api.post<{ message: string }>("/auth/logout"),
}

/* ------------------------------------------------------------------ */
/*  LOYALTY (consumer) API                                            */
/* ------------------------------------------------------------------ */

export const loyaltyAPI = {
  getUserData: async () => {
    let userId: number | null = null;
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id;
      }
    } catch {}
    if (!userId) throw new Error("User not found in localStorage");
    return api.get<{
      points: number;
      tier: string;
      rewards: any[];
      transactions: any[];
    }>(`/loyalty/user?userId=${userId}`);
  },
  simulatePurchase: (data: { userId: number; amount: number; type: string }) => {
    return api.post<{ pointsEarned: number }>("/transaction/simulate", data);
  },
  createPurchase: (data: { userId: number; amount: number; type: string }) => {
    return api.post("/transaction", data);
  },
  getRewards: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch("http://localhost:5000/api/campaign", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch rewards");
    const data = await res.json();
    // Map campaigns to rewards with a points property
    return (data.campaigns || []).map((c: any) => ({
      ...c,
      points: c.costInPoints ?? 0,
      userId: c.merchantId, // use merchantId for reward.userId
      name: c.name,
      description: c.shortDescription || c.conditionsDescription || "",
      image: c.campaignPhotoPath || "/placeholder.svg",
      category: Array.isArray(c.segments)
        ? c.segments.join(", ")
        : typeof c.segments === "string"
          ? (() => { try { return JSON.parse(c.segments).join(", "); } catch { return c.segments; } })()
          : "general",
      expiresIn: c.campaignActivityActiveTo || "N/A",
      featured: c.featured || false,
      id: c.campaignId || c.id,
    }));
  },
  getTransactions: async (page = 1, limit = 10) => {
    let userId: number | null = null;
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id;
      }
    } catch {}
    if (!userId) throw new Error("User not found in localStorage");
    return api.get<{ transactions: any[]; total: number; page: number; totalPages: number }>(`/transaction?userId=${userId}&page=${page}&limit=${limit}`);
  },
  associatePartner: async (userId: number, partnerId: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`http://localhost:5000/api/admin/members/${userId}/associate-partner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ partnerId }),
    });
    if (!res.ok) throw new Error("Failed to associate partner");
    return res.json();
  },
  getAllPartners: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch("/api/admin/partners?page=1&limit=1000", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch partners");
    const data = await res.json();
    return data.partners || [];
  },
}

/* ------------------------------------------------------------------ */
/*  ADMIN API                                                         */
/* ------------------------------------------------------------------ */

export const adminAPI = {
  getMembers: (page = 1, limit = 10, search = "") =>
    api.get<{
      members: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/members?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getMember: (id: string) => api.get<any>(`/admin/members/${id}`),

  updateMember: (id: string, data: any) => api.post<any>(`/admin/members/${id}`, data),

  suspendMember: (id: string, reason: string) =>
    api.post<{ message: string }>(`/admin/members/${id}/suspend`, {
      reason,
    }),

  getSystemSettings: () => api.get<any>("/admin/settings"),

  updateSystemSettings: (settings: any) => api.post<any>("/admin/settings", settings),

  getAnalytics: () =>
    api.get<{
      totalMembers: number
      activePartners: number
      pointsCirculating: number
      systemRevenue: number
      averagePointsPerMember: number
      totalSpent: number
      totalTransactions: number
      tierDistribution: {
        bronze: number
        silver: number
        gold: number
        platinum: number
      }
      topMembers: Array<{
        id: string
        name: string
        points: number
        tier: string
        totalSpent: number
      }>
      recentActivity: Array<{
        id: string | number
        name: string
        lastActivity: string
        points: number
      }>
      monthlyGrowth: Array<{
        month: string
        members: number
        revenue: number
        points: number
      }>
    }>("/admin/analytics"),

  getCustomersStats: () =>
    api.get<{
      total: number
      active: number
      inactive: number
      suspended: number
      averagePointsPerMember: number
      totalPoints: number
      totalSpent: number
      totalTransactions: number
      tierDistribution: {
        bronze: number
        silver: number
        gold: number
        platinum: number
      }
    }>("/admin/analytics/customers"),

  getActivity: () =>
    api.get<{
      activities: Array<{
        id: string | number
        type: string
        description: string
        timestamp: string
        icon?: string
        color?: string
        badge?: string
      }>
    }>("/admin/activity"),

  getMerchants: (page = 1, limit = 10, search = "") =>
    api.get<{
      merchants: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/merchants?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  createMerchant: (data: any) => api.post<any>("/admin/merchants", data),

  updateMerchant: (id: string, data: any) => api.post<any>(`/admin/merchants/${id}`, data),
  deleteMerchant: (id: string) => api.post<{ message: string }>(`/admin/merchants/${id}`, { _method: 'DELETE' }),

  getTransactions: (page = 1, limit = 10, search = "", status = "", type = "") =>
    api.get<{
      transactions: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/transactions?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}&type=${type}`),
}

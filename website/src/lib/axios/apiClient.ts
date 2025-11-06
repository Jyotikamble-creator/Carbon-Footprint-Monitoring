import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

/**
 * Helper to set Authorization header for the apiClient.
 * Pass undefined to remove the header.
 */
export function setAuthToken(token?: string) {
    if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common.Authorization;
    }
}

// Add response interceptor to normalize errors if desired
apiClient.interceptors.response.use(
    (r) => r,
    (error) => {
        // pass through, caller will categorize
        return Promise.reject(error);
    }
);

// Attach Authorization header per-request using the latest token from localStorage.
// This protects against races where a component issues a request before
// `setAuthToken` has been called, and handles cross-tab token updates.
apiClient.interceptors.request.use(
    (config) => {
        try {
            // Only run in the browser
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers = config.headers ?? {};
                    // Only set Authorization if not already provided on the config
                    if (!('Authorization' in (config.headers as Record<string, unknown>))) {
                        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
                    }
                } else {
                    // Ensure header removed when no token
                    if (config.headers) delete (config.headers as Record<string, unknown>).Authorization;
                }
            }
        } catch (e) {
            // ignore - best-effort header attach
        }
        return config;
    },
    (err) => Promise.reject(err)
);


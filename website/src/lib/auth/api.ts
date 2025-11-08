import { apiClient, setAuthToken } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";

export type SignupRequest={
    org_name:string;
    email:string;
    password:string;
};

export type LoginRequest={
    email:string;
    password:string;
};

export type TokenResponse={
    user_id?: number | null;
    access_token?: string | null;
    token_type?: string | null;
};

export type MeResponse = {
    id: number;
    email: string;
    role: string;
    org: {
        id: number;
        name: string;
        plan: string;
    };
};

export type ChangePasswordRequest = {
    current_password: string;
    new_password: string;
};

export type ChangePasswordResponse = {
    message: string;
};

export type NotificationSettings = {
    email_alerts: boolean;
    push_notifications: boolean;
    weekly_reports: boolean;
    system_updates: boolean;
    data_processing: boolean;
    security_alerts: boolean;
};

export type AccountSettings = {
    language: string;
    timezone: string;
    date_format: string;
    theme: string;
};

export type UserSettingsResponse = {
    notifications: NotificationSettings;
    account: AccountSettings;
};

export async function signup(data:SignupRequest): Promise<TokenResponse>{
    try {
        const response = await apiClient.post<TokenResponse>("/v1/auth/signup", data);
        console.log("Signup response:", response.data);
        return response.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

export function login(userId: number){
    try{
        const token = `user_authenticated_${userId}`;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId.toString());
        setAuthToken(token);
    }catch(err){
        console.error("Error in setting token in local storage", err);
    }
}

export async function loginApi(credentials: LoginRequest): Promise<TokenResponse> {
    try {
        const res = await apiClient.post<TokenResponse>("/v1/auth/login", credentials);
        console.log("Login response:", res.data);
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

/** Call backend /v1/auth/me to get current user */
export async function me(): Promise<MeResponse> {
    try {
        const res = await apiClient.get<MeResponse>(`/v1/auth/me`);
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

/** Change user password */
export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
        const res = await apiClient.post<ChangePasswordResponse>("/v1/auth/change-password", data);
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

/** Get user settings */
export async function getUserSettings(): Promise<UserSettingsResponse> {
    try {
        const res = await apiClient.get<UserSettingsResponse>("/v1/auth/settings");
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

/** Update notification settings */
export async function updateNotificationSettings(settings: NotificationSettings): Promise<{ message: string }> {
    try {
        const res = await apiClient.put<{ message: string }>("/v1/auth/settings/notifications", settings);
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

/** Update account settings */
export async function updateAccountSettings(settings: AccountSettings): Promise<{ message: string }> {
    try {
        const res = await apiClient.put<{ message: string }>("/v1/auth/settings/account", settings);
        return res.data;
    } catch (err) {
        throw categorizeAxiosError(err);
    }
}

export function logout(){
    try{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setAuthToken(undefined);
    }catch(err){
        console.error("Error while removing token", err);
    }
}
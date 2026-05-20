import axios from "axios";

export type ApiUser = {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    role: "USER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    password?: string;
};

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function getUsers(): Promise<ApiUser[]> {
    const { data } = await api.get<ApiUser[]>("/user");
    return data;
}

export async function getCurrentUserByPhone(phone: string): Promise<ApiUser | null> {
    const users = await getUsers();
    const found = users.find((u) => u.phone === phone);
    return found ?? null;
}

export async function getCurrentUserById(id: number): Promise<ApiUser | null> {
    const users = await getUsers();
    const found = users.find((u) => u.id === id);
    return found ?? null;
}

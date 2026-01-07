import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api", // Laravel backend
});

const BASE_URL = "http://localhost:8080/api/daily-expenses";

export async function fetchExpenses() {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export async function createExpense(data: any) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Create failed");
    return res.json();
}

export async function updateExpense(id: number, data: any) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
}

export async function deleteExpense(id: number) {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

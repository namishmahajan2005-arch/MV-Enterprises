import React from 'react'
import { jwtDecode } from "jwt-decode"

let refreshPromise = null;

export async function GetValidAccessToken() {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if(!refresh) return null;

    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
        if (access) {
            const { exp } = jwtDecode(access);
            const now = Date.now() / 1000;

            if (exp > now) {
            return access;
            }
        }

        const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });
        console.log("REFRESH STATUS:", res.status);

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        localStorage.setItem("access", data.access);

        return data.access;
        } catch {
            return null;
        } finally {
            refreshPromise = null;
        }
        })();
        
        return refreshPromise;
    }

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
  alert("You are being Logged out");
  window.location.href = "/login";
}

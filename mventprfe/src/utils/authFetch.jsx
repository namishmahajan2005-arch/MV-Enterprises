import { GetValidAccessToken } from "../Components/auth";

export async function authFetch(url, options = {}) {
  const token = await GetValidAccessToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

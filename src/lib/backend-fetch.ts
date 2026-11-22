import { siteConfig } from "@/config/site";
import { getToken } from "@/lib/session";

export async function backendFetch(path: string, init: RequestInit) {
  const token = await getToken();
  if (!token) return null;
  return fetch(`${siteConfig.apiUrl}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  });
}

import type { CreateTemplatePayload, Template } from "@/types/templates";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  data: T;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const templatesApi = {
  async getTemplates() {
    const response = await request<ApiResponse<Template[]>>("/api/templates");
    return response.data;
  },

  async createTemplate(payload: CreateTemplatePayload) {
    const response = await request<ApiResponse<Template>>("/api/templates", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async deleteTemplate(templateId: string) {
    await request<void>(`/api/templates/${templateId}`, {
      method: "DELETE",
    });
  },
};

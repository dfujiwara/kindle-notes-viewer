export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: Record<string, string>;
  body?: unknown;
}

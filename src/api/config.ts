export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const SLIDES_API_BASE =
  import.meta.env.VITE_SLIDES_API_BASE_URL ?? API_BASE;

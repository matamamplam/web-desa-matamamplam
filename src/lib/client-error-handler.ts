import { toast } from "react-hot-toast";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}

/**
 * Handles errors on the client side and displays interactive alerts (Toasts).
 * Ignores 404 errors by default (unless forceToast is true).
 */
export function handleClientError(error: any, customMessage?: string) {
  console.error("Client Error Caught:", error);

  // 1. Handle Network/Fetch Errors
  if (!error.response && error.message === "Failed to fetch") {
    toast.error("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    return;
  }

  // 2. Parse API Response Error if available
  // This expects the error object to have a 'response' property (like from axios) 
  // or be the JSON body itself if already parsed.
  
  let message = customMessage || error.message || "Terjadi kesalahan yang tidak terduga.";
  let status = error.status || 500;
  let code = error.code || "UNKNOWN";

  // If the error object *is* the API response (e.g. from a custom fetch wrapper)
  if (error.success === false && error.error) {
     message = error.message;
     code = error.error.code;
  }

  // 3. Filter by Status/Code
  
  // IGNORE 404 (Page Not Found / Resource Not Found) as per user request
  if (status === 404 || code === "RESOURCE_NOT_FOUND" || code === "NOT_FOUND") {
    console.warn("Suppressed 404 Toast:", message);
    return;
  }

  // 4. Specific Error Handling
  if (status === 429 || code === "RATE_LIMIT_EXCEEDED") {
    toast.error("Terlalu banyak permintaan. Mohon tunggu sebentar.");
    return;
  }

  if (status === 401 || code === "AUTH_UNAUTHORIZED") {
    toast.error("Sesi berakhir atau Anda tidak memiliki akses. Silakan login ulang.");
    return;
  }

  if (status === 400 || code === "VALIDATION_ERROR") {
    // If there are specific details (e.g. "Email invalid"), ideally show them
    // For now, simpler toast
    toast.error(message); 
    return;
  }

  // 5. Fallback System Error
  toast.error(message);
}

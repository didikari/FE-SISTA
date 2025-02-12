import { useNuxtApp } from "#app";

interface ApiResponse<T> {
  code: number;
  message?: string;
  data?: T;
  errors?: any;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T | null }> => {
  const { $apiClient } = useNuxtApp();

  try {
    const response = (await $apiClient(
      endpoint,
      options
    )) as unknown as ApiResponse<T> & { _data?: ApiResponse<T> };

    const responseData: ApiResponse<T> = response._data ?? response;

    return responseData.code >= 400
      ? {
          success: false,
          message: responseData.message ?? "Request failed.",
          data: null,
        }
      : {
          success: true,
          message: responseData.message ?? "Request successful.",
          data: responseData.data ?? null,
        };
  } catch (error: any) {
    const errorResponse = error.response?._data ?? error.response;
    const parsedError = errorResponse as ApiResponse<null> | undefined;

    return {
      success: false,
      message: parsedError?.message ?? error.message ?? "An error occurred.",
      data: null,
    };
  }
};

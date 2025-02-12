// types/nuxt.d.ts
import type { FetchOptions } from "ofetch";

declare module "#app" {
  interface NuxtApp {
    $apiClient<T>(url: string, options?: FetchOptions): Promise<T>;
    $clearStores: () => void;
  }
}

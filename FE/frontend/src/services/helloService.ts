import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface HelloResponse {
  message: string;
}

export const helloService = {
  getMessage: () => apiClient.get<HelloResponse>(ENDPOINTS.hello.getMessage),
};

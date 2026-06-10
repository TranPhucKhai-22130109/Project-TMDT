import { apiFetch } from "@/config/api";

export async function getSearchSuggestions(keyword) {
    return apiFetch(
        `/search/suggestions?keyword=${encodeURIComponent(keyword)}`
    );
}
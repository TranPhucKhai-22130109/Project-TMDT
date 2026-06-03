package com.example.ecommerce.dto.response;

import java.util.List;

public class SearchSuggestionResponse {

    private List<ProductSuggestionResponse> products;
    private List<SellerSuggestionResponse> sellers;

    public SearchSuggestionResponse() {
    }

    public SearchSuggestionResponse(
            List<ProductSuggestionResponse> products,
            List<SellerSuggestionResponse> sellers
    ) {
        this.products = products;
        this.sellers = sellers;
    }

    public List<ProductSuggestionResponse> getProducts() {
        return products;
    }

    public void setProducts(List<ProductSuggestionResponse> products) {
        this.products = products;
    }

    public List<SellerSuggestionResponse> getSellers() {
        return sellers;
    }

    public void setSellers(List<SellerSuggestionResponse> sellers) {
        this.sellers = sellers;
    }
}
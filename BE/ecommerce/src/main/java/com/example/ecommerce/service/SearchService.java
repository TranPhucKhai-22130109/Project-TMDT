package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.dto.response.ProductSuggestionResponse;
import com.example.ecommerce.dto.response.SearchSuggestionResponse;
import com.example.ecommerce.dto.response.SellerSuggestionResponse;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    public SearchSuggestionResponse getSuggestions(
            String keyword
    ) {

        Pageable limitFive = PageRequest.of(0, 5);

        List<ProductSuggestionResponse> products =
                productRepository.searchSuggestions(
                                keyword,
                                limitFive
                        )
                        .stream()
                        .map(product ->
                                new ProductSuggestionResponse(
                                        product.getId(),
                                        product.getName(),
                                        product.getImageUrl(),
                                        product.getPrice()
                                )
                        )
                        .toList();

        List<SellerSuggestionResponse> sellers =
                userRepository.searchSellerSuggestions(
                                keyword,
                                limitFive
                        )
                        .stream()
                        .map(user ->
                                new SellerSuggestionResponse(
                                        user.getId(),
                                        user.getUsername(),
                                        user.getAvatarUrl()
                                )
                        )
                        .toList();

        return new SearchSuggestionResponse(
                products,
                sellers
        );
    }
}

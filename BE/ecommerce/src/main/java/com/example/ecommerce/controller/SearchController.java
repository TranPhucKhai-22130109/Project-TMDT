package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.SearchSuggestionResponse;
import com.example.ecommerce.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/suggestions")
    public ResponseEntity<SearchSuggestionResponse> suggestions(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(
                searchService.getSuggestions(keyword)
        );
    }
}

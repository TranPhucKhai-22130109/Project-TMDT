package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.auction.PlaceBidRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.AuctionWinnerResponse;
import com.example.ecommerce.dto.response.BidResponse;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping("/bid")
    public ResponseEntity<ApiResponse<BidResponse>> placeBid(@RequestBody PlaceBidRequest request) {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                ApiResponse.<BidResponse>builder()
                        .success(true)
                        .code("PLACE_BID_SUCCESS")
                        .message("Place bid successfully")
                        .data(auctionService.placeBid(request, jwt.getSubject()))
                        .build()
        );
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAuctionProducts() {
        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .code("GET_AUCTION_PRODUCTS_SUCCESS")
                        .message("Get auction products successfully")
                        .data(auctionService.getAuctionProducts())
                        .build()
        );
    }

    @GetMapping("/my-won")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMyWonAuctions() {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .code("GET_MY_WON_AUCTIONS_SUCCESS")
                        .message("Get my won auctions successfully")
                        .data(auctionService.getMyWonAuctions(jwt.getSubject()))
                        .build()
        );
    }

    @GetMapping("/{productId}/bids")
    public ResponseEntity<ApiResponse<List<BidResponse>>> getBidHistory(@PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.<List<BidResponse>>builder()
                        .success(true)
                        .code("GET_BID_HISTORY_SUCCESS")
                        .message("Get bid history successfully")
                        .data(auctionService.getBidHistory(productId))
                        .build()
        );
    }

    @GetMapping("/{productId}/current")
    public ResponseEntity<ApiResponse<BidResponse>> getCurrentHighestBid(@PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.<BidResponse>builder()
                        .success(true)
                        .code("GET_CURRENT_HIGHEST_BID_SUCCESS")
                        .message("Get current highest bid successfully")
                        .data(auctionService.getCurrentHighestBid(productId))
                        .build()
        );
    }

    @GetMapping("/{productId}/winner")
    public ResponseEntity<ApiResponse<AuctionWinnerResponse>> getAuctionWinner(@PathVariable Long productId) {
        return ResponseEntity.ok(
                ApiResponse.<AuctionWinnerResponse>builder()
                        .success(true)
                        .code("GET_AUCTION_WINNER_SUCCESS")
                        .message("Get auction winner successfully")
                        .data(auctionService.getAuctionWinner(productId))
                        .build()
        );
    }
}

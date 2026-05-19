package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.comment.ProductCommentRequest;
import com.example.ecommerce.dto.response.comment.ProductCommentResponse;
import com.example.ecommerce.service.comment.ProductCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/comments")
@RequiredArgsConstructor
public class ProductCommentController {

    private final ProductCommentService commentService;

    @PostMapping
    public ProductCommentResponse createComment(
            @PathVariable Long productId,
            @RequestBody ProductCommentRequest request
    ) {
        return commentService.createComment(productId, request);
    }

    @PostMapping("/{commentId}/reply")
    public ProductCommentResponse replyComment(
            @PathVariable Long productId,
            @PathVariable Long commentId,
            @RequestBody ProductCommentRequest request
    ) {
        return commentService.replyComment(productId, commentId, request);
    }

    @GetMapping
    public List<ProductCommentResponse> getComments(
            @PathVariable Long productId
    ) {
        return commentService.getComments(productId);
    }

    @PutMapping("/{commentId}")
    public ProductCommentResponse updateComment(
            @PathVariable Long productId,
            @PathVariable Long commentId,
            @RequestBody ProductCommentRequest request
    ) {
        return commentService.updateComment(productId, commentId, request);
    }

    @DeleteMapping("/{commentId}")
    public Map<String, String> deleteComment(
            @PathVariable Long productId,
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(productId, commentId);
        return Map.of("message", "Delete comment successfully");
    }
}

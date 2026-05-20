package com.example.ecommerce.service.comment;

import com.example.ecommerce.dto.request.comment.ProductCommentRequest;
import com.example.ecommerce.dto.response.comment.ProductCommentResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductComment;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.ProductCommentRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductCommentService {

    private final ProductRepository productRepository;
    private final ProductCommentRepository commentRepository;
    private final UserRepository userRepository;

    public ProductCommentResponse createComment(Long productId, ProductCommentRequest request) {
        Product product = getProduct(productId);
        User user = getCurrentUser();

        ProductComment comment = new ProductComment();
        comment.setContent(request.getContent());
        comment.setProduct(product);
        comment.setUser(user);
        comment.setParent(null);
        comment.setIsDeleted(false);
        comment.setCreatedAt(LocalDateTime.now());

        ProductComment savedComment = commentRepository.save(comment);

        return mapToResponse(savedComment);
    }

    public ProductCommentResponse replyComment(Long productId, Long commentId, ProductCommentRequest request) {
        Product product = getProduct(productId);
        User user = getCurrentUser();

        ProductComment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!parentComment.getProduct().getId().equals(product.getId())) {
            throw new RuntimeException("Comment does not belong to this product");
        }

        ProductComment reply = new ProductComment();
        reply.setContent(request.getContent());
        reply.setProduct(product);
        reply.setUser(user);
        reply.setParent(parentComment);
        reply.setIsDeleted(false);
        reply.setCreatedAt(LocalDateTime.now());

        ProductComment savedReply = commentRepository.save(reply);

        return mapToResponse(savedReply);
    }

    public List<ProductCommentResponse> getComments(Long productId) {
        getProduct(productId);

        return commentRepository
                .findByProductIdAndIsDeletedFalseOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private User getCurrentUser() {

        String userId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findById(String.valueOf(UUID.fromString(userId)))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProductCommentResponse mapToResponse(ProductComment comment) {
        User currentUser = getCurrentUserOrNull();

        return ProductCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .userAvatar(comment.getUser().getAvatarUrl())
                .productId(comment.getProduct().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt())
                .isOwner(currentUser != null && comment.getUser().getId().equals(currentUser.getId()))
                .build();
    }

    private User getCurrentUserOrNull() {
        try {
            String userId = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName();

            return userRepository.findById(String.valueOf(UUID.fromString(userId))).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private ProductComment getCommentInProduct(Long productId, Long commentId) {
        ProductComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Comment does not belong to this product");
        }

        return comment;
    }

    public ProductCommentResponse updateComment(Long productId, Long commentId, ProductCommentRequest request) {
        ProductComment comment = getCommentInProduct(productId, commentId);
        User currentUser = getCurrentUser();

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only edit your own comment");
        }

        if (comment.getIsDeleted()) {
            throw new RuntimeException("Comment has been deleted");
        }

        comment.setContent(request.getContent());

        ProductComment savedComment = commentRepository.save(comment);

        return mapToResponse(savedComment);
    }

    public void deleteComment(Long productId, Long commentId) {
        ProductComment comment = getCommentInProduct(productId, commentId);
        User currentUser = getCurrentUser();

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own comment");
        }

        comment.setIsDeleted(true);
        commentRepository.save(comment);
    }
}
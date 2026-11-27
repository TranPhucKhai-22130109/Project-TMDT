package com.example.ecommerce.controller;

import com.cloudinary.Cloudinary;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductControllerTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private Cloudinary cloudinary;

    @InjectMocks
    private ProductController productController;

    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        User seller = new User();
        seller.setId("seller-1");
        seller.setUsername("seller_model");
        seller.setEmail("seller@gmail.com");

        product1 = new Product();
        product1.setId(1L);
        product1.setName("Lamborghini Aventador SVJ");
        product1.setPrice(1200000.0);
        product1.setSoldQuantity(20);
        product1.setStockQuantity(5);
        product1.setScale("1:18");
        product1.setMarque("AutoArt");
        product1.setIsApproved(true);
        product1.setIsDeleted(false);
        product1.setSeller(seller);

        product2 = new Product();
        product2.setId(2L);
        product2.setName("Ferrari SF90 Stradale");
        product2.setPrice(2500000.0);
        product2.setSoldQuantity(45);
        product2.setStockQuantity(10);
        product2.setScale("1:18");
        product2.setMarque("BBR");
        product2.setIsApproved(true);
        product2.setIsDeleted(false);
        product2.setSeller(seller);
    }

    @Test
    @DisplayName("TC_SORT_01: Sắp xếp sản phẩm theo Giá tăng dần (price, asc)")
    void testGetSortedProducts_PriceAsc() {
        when(productRepository.findByIsDeletedFalseAndIsApprovedTrue(Sort.by("price").ascending()))
                .thenReturn(List.of(product1, product2));

        List<ProductResponse> result = productController.getSortedProducts("price", "asc");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(1200000.0, result.get(0).getPrice());
        verify(productRepository).findByIsDeletedFalseAndIsApprovedTrue(Sort.by("price").ascending());
    }

    @Test
    @DisplayName("TC_SORT_02: Sắp xếp sản phẩm theo Giá giảm dần (price, desc)")
    void testGetSortedProducts_PriceDesc() {
        when(productRepository.findByIsDeletedFalseAndIsApprovedTrue(Sort.by("price").descending()))
                .thenReturn(List.of(product2, product1));

        List<ProductResponse> result = productController.getSortedProducts("price", "desc");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(2L, result.get(0).getId());
        assertEquals(2500000.0, result.get(0).getPrice());
        verify(productRepository).findByIsDeletedFalseAndIsApprovedTrue(Sort.by("price").descending());
    }

    @Test
    @DisplayName("TC_SORT_03: Sắp xếp sản phẩm theo Mới nhất (id, desc)")
    void testGetSortedProducts_Latest() {
        when(productRepository.findByIsDeletedFalseAndIsApprovedTrue(Sort.by("id").descending()))
                .thenReturn(List.of(product2, product1));

        List<ProductResponse> result = productController.getSortedProducts("id", "desc");

        assertNotNull(result);
        assertEquals(2L, result.get(0).getId());
    }

    @Test
    @DisplayName("TC_SHOP_03: Lấy danh sách sản phẩm thuộc quyền sở hữu của riêng gian hàng")
    void testGetProductsBySellerId_Success() {
        when(productRepository.findBySellerIdAndIsDeletedFalse("seller-1"))
                .thenReturn(List.of(product1, product2));

        List<ProductResponse> result = productController.getProductsBySellerId("seller-1");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("seller-1", result.get(0).getSellerId());
        verify(productRepository, times(1)).findBySellerIdAndIsDeletedFalse("seller-1");
    }

    @Test
    @DisplayName("TC_HOME_NEW_04: Lấy chi tiết sản phẩm theo ID")
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));

        ProductResponse response = productController.getProductById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Lamborghini Aventador SVJ", response.getName());
    }
}

package com.example.ecommerce.seed;

import com.example.ecommerce.dto.requesy.ProductJson;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {

        if (productRepository.count() > 0) {
            System.out.println("Data already exists, skip seeding...");
            return;
        }

        File folder = new ClassPathResource("data/product").getFile();

        File[] jsonFiles = folder.listFiles((dir, name) ->
                name.toLowerCase().endsWith(".json")
        );

        if (jsonFiles == null || jsonFiles.length == 0) {
            System.out.println("No JSON files found in data/product");
            return;
        }

        List<Product> products = new ArrayList<>();

        for (File file : jsonFiles) {
            try (InputStream inputStream = new FileInputStream(file)) {

                List<ProductJson> jsonList = objectMapper.readValue(
                        inputStream,
                        new TypeReference<List<ProductJson>>() {}
                );

                List<Product> productList = jsonList.stream().map(p -> {
                    Product product = new Product();

                    product.setName(p.getName());

                    if (p.getImg() != null && !p.getImg().isEmpty()) {
                        product.setImageUrl(p.getImg().get(0));

                        try {
                            product.setImages(objectMapper.writeValueAsString(p.getImg()));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    if (p.getItemInfo() != null) {
                        product.setItemNo(p.getItemInfo().getItemNo());
                        product.setScale(p.getItemInfo().getScale());
                        product.setMarque(p.getItemInfo().getMarque());
                        product.setStatus(p.getItemInfo().getStatus());
                    }

                    product.setDescription(p.getDescription());

                    return product;
                }).toList();

                products.addAll(productList);
            }
        }

        productRepository.saveAll(products);

        System.out.println("Seed data thành công! Total products: " + products.size());
    }
}
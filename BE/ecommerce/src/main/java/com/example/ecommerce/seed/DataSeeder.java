package com.example.ecommerce.seed;

import com.example.ecommerce.dto.request.product.ProductJson;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.UserRole;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.RoleRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        updateMissingUserInfo();

        if (productRepository.count() > 0) {
            System.out.println("Data already exists, skip seeding...");
            return;
        }

        List<User> sellers = seedSellers();

        if (productRepository.count() > 0) {
            System.out.println("Data already exists, skip seeding...");
            return;
        }

        File folder = new ClassPathResource("data/product").getFile();

        File[] jsonFiles = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".json"));

        if (jsonFiles == null || jsonFiles.length == 0) {
            System.out.println("No JSON files found in data/product");
            return;
        }

        List<Product> products = new ArrayList<>();

        int sellerIndex = 0;

        for (File file : jsonFiles) {
            try (InputStream inputStream = new FileInputStream(file)) {

                List<ProductJson> jsonList = objectMapper.readValue(
                        inputStream,
                        new TypeReference<List<ProductJson>>() {
                        });

                Collections.shuffle(jsonList);

                for (ProductJson p : jsonList) {
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
                    }

                    product.setDescription(p.getDescription());
                    product.setPrice(generatePrice(p));
                    product.setSoldQuantity(generateSoldQuantity());

                    Boolean isAuction = generateIsAuction();
                    product.setIsAuction(isAuction);
                    product.setStatus(resolveProductStatus(p, isAuction));

                    product.setIsApproved(true);
                    product.setIsDeleted(false);

                    if (isAuction) {
                        product.setStockQuantity(1);
                        applyAuctionSeedData(product);
                    } else {
                        product.setStockQuantity(generateStockQuantity());
                    }

                    User seller = sellers.get(sellerIndex % sellers.size());
                    product.setSeller(seller);
                    sellerIndex++;

                    products.add(product);
                }
            }
        }

        productRepository.saveAll(products);

        System.out.println("Seed data thành công!");
        System.out.println("Total sellers: " + sellers.size());
        System.out.println("Total products: " + products.size());
    }

    private List<User> seedSellers() {
        List<User> sellers = new ArrayList<>();
        Role sellerRole = roleRepository.findByRoleName("SELLER")
                .orElseThrow(() -> new RuntimeException("SELLER role not found"));
        for (int i = 1; i <= 50; i++) {
            String email = "seller" + i + "@gmail.com";

            User seller = userRepository.findByEmail(email).orElse(null);

            if (seller == null) {
                seller = new User();
                seller.setUsername("Seller " + i);
                seller.setEmail(email);
                seller.setPassword(passwordEncoder.encode("123456"));

                seller.setAvatarUrl(generateAvatarUrl("Seller " + i));
                seller.setPhoneNumber(generateVietnamPhoneNumber());

                seller = userRepository.save(seller);

                UserRole userRole = new UserRole();
                userRole.setUser(seller);
                userRole.setRole(sellerRole);

                userRoleRepository.save(userRole);

                seller = userRepository.save(seller);
            }

            sellers.add(seller);
        }

        Collections.shuffle(sellers);

        return sellers;
    }

    private Integer generateSoldQuantity() {
        return 500 + (int) (Math.random() * (1500 - 500 + 1));
    }

    private String generateAvatarUrl(String seed) {
        return "https://api.dicebear.com/9.x/notionists/svg?seed="
                + seed.replace(" ", "%20");
    }

    private String generateVietnamPhoneNumber() {
        String[] prefixes = {
                "032", "033", "034", "035", "036", "037", "038", "039",
                "070", "076", "077", "078", "079",
                "081", "082", "083", "084", "085",
                "056", "058", "059"
        };

        String prefix = prefixes[randomBetween(0, prefixes.length - 1)];

        StringBuilder phone = new StringBuilder(prefix);
        for (int i = 0; i < 7; i++) {
            phone.append(randomBetween(0, 9));
        }

        return phone.toString();
    }

    private Double generatePrice(ProductJson p) {
        String scale = "";
        String marque = "";

        if (p.getItemInfo() != null) {
            scale = p.getItemInfo().getScale();
            marque = p.getItemInfo().getMarque();
        }

        int min;
        int max;

        if ("1:18".equals(scale)) {
            min = 300000;
            max = 1000000;
        } else if ("1:24".equals(scale)) {
            min = 400000;
            max = 1050000;
        } else if ("1:43".equals(scale)) {
            min = 450000;
            max = 1000000;
        } else if ("1:64".equals(scale)) {
            min = 500000;
            max = 2000000;
        } else {
            min = 250000;
            max = 600000;
        }

        if (marque != null) {
            String m = marque.toLowerCase();

            if (m.contains("minigt") || m.contains("mini gt")
                    || m.contains("tarmac")
                    || m.contains("inno")
                    || m.contains("pop race")
                    || m.contains("kyosho")
                    || m.contains("tomica")) {
                min += 80000;
                max += 250000;
            }
        }

        int price = min + (int) (Math.random() * (max - min + 1));
        price = Math.round(price / 10000f) * 10000;

        return (double) price;
    }

    private Integer generateStockQuantity() {
        return 5 + (int) (Math.random() * (120 - 5 + 1));
    }

    private Boolean generateIsAuction() {
        return Math.random() < 0.2;
    }

    private ProductStatus resolveProductStatus(ProductJson p, Boolean isAuction) {
        if (Boolean.TRUE.equals(isAuction)) {
            return Math.random() < 0.5
                    ? ProductStatus.OPEN
                    : ProductStatus.SCHEDULED;
        }

        if (p.getItemInfo() != null && p.getItemInfo().getStatus() != null) {
            String status = p.getItemInfo().getStatus().toLowerCase();

            if (status.contains("pre")) {
                return ProductStatus.PRE_ORDER;
            }
        }

        return ProductStatus.RELEASED;
    }

    private void applyAuctionSeedData(Product product) {
        BigDecimal startPrice = BigDecimal.valueOf(product.getPrice());
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime;

        if (product.getStatus() == ProductStatus.OPEN) {
            startTime = now.minusHours(randomBetween(1, 24));
        } else {
            startTime = now.plusHours(randomBetween(1, 72));
        }

        product.setAuctionStartPrice(startPrice);
        product.setCurrentPrice(startPrice);
        product.setAuctionStartTime(startTime);
        product.setAuctionEndTime(startTime.plusDays(randomBetween(1, 7)));
    }

    private int randomBetween(int min, int max) {
        return min + (int) (Math.random() * (max - min + 1));
    }

    private void updateMissingUserInfo() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            boolean changed = false;

            if (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank()) {
                user.setAvatarUrl(generateAvatarUrl(user.getUsername()));
                changed = true;
            }

            if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
                user.setPhoneNumber(generateVietnamPhoneNumber());
                changed = true;
            }

            if (changed) {
                userRepository.save(user);
            }
        }

        System.out.println("Updated missing avatarUrl and phoneNumber");
    }
}

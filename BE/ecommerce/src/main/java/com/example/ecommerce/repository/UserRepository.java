package com.example.ecommerce.repository;



import com.example.ecommerce.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    String findEmailById(String id);

    @Query("""
SELECT DISTINCT ur.user
FROM UserRole ur
WHERE ur.role.roleName = 'SELLER'
  AND LOWER(ur.user.username)
      LIKE LOWER(CONCAT('%', :keyword, '%'))
ORDER BY
CASE
    WHEN LOWER(ur.user.username) = LOWER(:keyword) THEN 0
    WHEN LOWER(ur.user.username)
         LIKE LOWER(CONCAT(:keyword, '%'))
    THEN 1
    ELSE 2
END,
ur.user.username
""")
    List<User> searchSellerSuggestions(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}



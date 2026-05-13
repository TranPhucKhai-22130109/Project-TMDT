package com.example.ecommerce.seed;

import com.example.ecommerce.entity.Role;
import com.example.ecommerce.enums.RoleName;
import com.example.ecommerce.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        createRole(RoleName.USER.name());
        createRole(RoleName.SELLER.name());
        createRole(RoleName.ADMIN.name());

    }

    private void createRole(String roleName) {

        if (roleRepository.findByRoleName(roleName).isEmpty()) {

            Role role = new Role();
            role.setRoleName(roleName);

            roleRepository.save(role);
        }
    }
}
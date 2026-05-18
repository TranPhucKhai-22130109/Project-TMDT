package com.example.ecommerce.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class FirebaseConfig {
    @Value("${firebase.service-account-path}")
    private Resource serviceAccountResource;

    @Bean
    @Lazy(false)
    public FirebaseApp firebaseApp() throws IOException {
        System.out.println(">>> Service account path: " + serviceAccountResource.getFilename());
        System.out.println(">>> File exists: " + serviceAccountResource.exists());

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(serviceAccountResource.getInputStream());

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}

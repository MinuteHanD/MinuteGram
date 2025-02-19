package com.fuckgram.config;

import com.fuckgram.service.StorageService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {
    @Bean
    public StorageService storageService() {
        return new StorageService();
    }
}

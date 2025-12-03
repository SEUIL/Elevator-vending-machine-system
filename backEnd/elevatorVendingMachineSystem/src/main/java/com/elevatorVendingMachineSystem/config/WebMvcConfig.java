package com.elevatorVendingMachineSystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 브라우저 요청 URL: /images/**
        // 실제 파일 위치: file:///C:/elevator-vending-uploads/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/elevator-vending-uploads/");
    }
}
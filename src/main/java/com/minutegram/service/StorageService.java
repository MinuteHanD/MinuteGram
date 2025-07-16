package com.minutegram.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;


@Service
public class StorageService {
    private final Cloudinary cloudinary;

    public StorageService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public Map<String, String> store(MultipartFile file) {
        try {
            
            if ("your_cloud_name".equals(cloudinary.config.cloudName) || 
                "your_api_key".equals(cloudinary.config.apiKey)) {
                
                return storeLocally(file);
            }
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
            Map<String, String> result = new HashMap<>();
            result.put("url", (String) uploadResult.get("secure_url"));
            result.put("mediaType", (String) uploadResult.get("resource_type")); 
            return result;
        } catch (Exception e) {
            System.out.println("Cloudinary upload failed, falling back to local storage: " + e.getMessage());
            return storeLocally(file);
        }
    }
    
    private Map<String, String> storeLocally(MultipartFile file) {
        try {
           
            String uploadDir = System.getProperty("user.home") + "/minutegram/uploads";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = java.util.UUID.randomUUID().toString() + extension;
            
            
            java.nio.file.Path filePath = uploadPath.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            
            String mediaType = file.getContentType().startsWith("video/") ? "video" : "image";
            
            
            Map<String, String> result = new HashMap<>();
            result.put("url", "http://localhost:8080/uploads/" + filename);
            result.put("mediaType", mediaType);
            return result;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file locally", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    private String extractPublicId(String fileUrl) {
        String[] parts = fileUrl.split("/");
        String fileName = parts[parts.length - 1];
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
}
package com.fuckgram.service;

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
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
            Map<String, String> result = new HashMap<>();
            result.put("url", (String) uploadResult.get("secure_url"));
            result.put("mediaType", (String) uploadResult.get("resource_type")); // "image" or "video"
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
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
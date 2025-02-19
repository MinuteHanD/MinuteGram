package com.fuckgram.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${app.upload.dir:${user.home}/minutegram/uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    public String store(MultipartFile file) {
        try {
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(filename));

            return baseUrl + "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path file = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
package com.minutegram.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "*")
public class FileController {

    @Value("${app.upload.dir:${user.home}/minutegram/uploads}")
    private String uploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new FileSystemResource(filePath);
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = "application/octet-stream";
            if (filename.toLowerCase().endsWith(".mp4")) {
                contentType = "video/mp4";
            } else if (filename.toLowerCase().endsWith(".webm")) {
                contentType = "video/webm";
            } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .header("Accept-Ranges", "bytes")
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
package com.piyush.cms.controller;

import com.piyush.cms.dto.ApiResponse;
import com.piyush.cms.model.MediaFile;
import com.piyush.cms.service.ContentService;
import com.piyush.cms.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/media")
public class MediaController {

    private final FileStorageService fileStorageService;
    private final ContentService contentService;

    public MediaController(FileStorageService fileStorageService, ContentService contentService) {
        this.fileStorageService = fileStorageService;
        this.contentService = contentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaFile>> uploadFile(@RequestParam("file") MultipartFile file) {
        MediaFile savedMedia = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", savedMedia));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MediaFile>>> getAllMedia() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllMediaFiles()));
    }
}

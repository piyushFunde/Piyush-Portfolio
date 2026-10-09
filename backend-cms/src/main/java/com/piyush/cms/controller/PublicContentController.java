package com.piyush.cms.controller;

import com.piyush.cms.dto.ApiResponse;
import com.piyush.cms.dto.ContactRequest;
import com.piyush.cms.model.*;
import com.piyush.cms.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
public class PublicContentController {

    private final ContentService contentService;
    private final javax.sql.DataSource dataSource;

    public PublicContentController(ContentService contentService, javax.sql.DataSource dataSource) {
        this.contentService = contentService;
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getHealth() {
        java.util.Map<String, Object> health = new java.util.HashMap<>();
        health.put("status", "UP");
        health.put("version", "3.2.5");
        health.put("timestamp", java.time.LocalDateTime.now().toString());

        boolean dbOk = false;
        try (java.sql.Connection conn = dataSource.getConnection()) {
            dbOk = conn.isValid(2);
            health.put("databaseType", conn.getMetaData().getDatabaseProductName());
        } catch (Exception e) {
            health.put("databaseError", e.getMessage());
        }
        health.put("databaseStatus", dbOk ? "CONNECTED" : "DISCONNECTED");

        return ResponseEntity.ok(ApiResponse.success(health));
    }

    @GetMapping("/about")
    public ResponseEntity<ApiResponse<About>> getAbout() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAbout()));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getProjects(
            @RequestParam(required = false, defaultValue = "false") boolean featured) {
        List<Project> projects = featured ? contentService.getFeaturedProjects() : contentService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        return contentService.getProjectById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills(
            @RequestParam(required = false) String category) {
        List<Skill> skills = (category != null && !category.isEmpty())
                ? contentService.getSkillsByCategory(category)
                : contentService.getAllSkills();
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getExperience() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllExperience()));
    }

    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<List<Certificate>>> getCertificates() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllCertificates()));
    }

    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<Blog>>> getBlogs() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getPublishedBlogs()));
    }

    @GetMapping("/blogs/{slug}")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        return contentService.getBlogBySlug(slug)
                .map(b -> ResponseEntity.ok(ApiResponse.success(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/gallery")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> getGallery() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllGalleryItems()));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<String>> submitContact(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getSubject() != null ? request.getSubject() : "Portfolio Contact Form Message",
                request.getMessage()
        );
        contentService.saveMessage(message);
        return ResponseEntity.ok(ApiResponse.success("Message received successfully! I will get back to you soon.", null));
    }
}

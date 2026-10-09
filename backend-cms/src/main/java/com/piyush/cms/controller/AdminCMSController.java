package com.piyush.cms.controller;

import com.piyush.cms.dto.ApiResponse;
import com.piyush.cms.model.*;
import com.piyush.cms.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminCMSController {

    private final ContentService contentService;

    public AdminCMSController(ContentService contentService) {
        this.contentService = contentService;
    }

    // --- Dashboard Stats ---
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", contentService.getAllProjects().size());
        stats.put("totalSkills", contentService.getAllSkills().size());
        stats.put("totalBlogs", contentService.getAllBlogs().size());
        stats.put("totalCertificates", contentService.getAllCertificates().size());
        stats.put("totalExperience", contentService.getAllExperience().size());
        stats.put("totalGalleryItems", contentService.getAllGalleryItems().size());
        stats.put("unreadMessages", contentService.getUnreadMessageCount());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // --- About ---
    @PutMapping("/about")
    public ResponseEntity<ApiResponse<About>> updateAbout(@RequestBody About about) {
        return ResponseEntity.ok(ApiResponse.success("About section updated", contentService.saveAbout(about)));
    }

    // --- Projects CRUD ---
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllProjects()));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Project>> createProject(@Valid @RequestBody Project project) {
        return ResponseEntity.ok(ApiResponse.success("Project created", contentService.saveProject(project)));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        project.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Project updated", contentService.saveProject(project)));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        contentService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    // --- Skills CRUD ---
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllSkills()));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@Valid @RequestBody Skill skill) {
        return ResponseEntity.ok(ApiResponse.success("Skill created", contentService.saveSkill(skill)));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable Long id, @Valid @RequestBody Skill skill) {
        skill.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Skill updated", contentService.saveSkill(skill)));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        contentService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }

    // --- Experience CRUD ---
    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperience() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllExperience()));
    }

    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<Experience>> createExperience(@Valid @RequestBody Experience experience) {
        return ResponseEntity.ok(ApiResponse.success("Experience created", contentService.saveExperience(experience)));
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable Long id, @Valid @RequestBody Experience experience) {
        experience.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Experience updated", contentService.saveExperience(experience)));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        contentService.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.success("Experience deleted successfully", null));
    }

    // --- Certificates CRUD ---
    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<List<Certificate>>> getAllCertificates() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllCertificates()));
    }

    @PostMapping("/certificates")
    public ResponseEntity<ApiResponse<Certificate>> createCertificate(@Valid @RequestBody Certificate certificate) {
        return ResponseEntity.ok(ApiResponse.success("Certificate created", contentService.saveCertificate(certificate)));
    }

    @PutMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<Certificate>> updateCertificate(@PathVariable Long id, @Valid @RequestBody Certificate certificate) {
        certificate.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate updated", contentService.saveCertificate(certificate)));
    }

    @DeleteMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertificate(@PathVariable Long id) {
        contentService.deleteCertificate(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate deleted successfully", null));
    }

    // --- Blogs CRUD ---
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<Blog>>> getAllBlogs() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllBlogs()));
    }

    @PostMapping("/blogs")
    public ResponseEntity<ApiResponse<Blog>> createBlog(@Valid @RequestBody Blog blog) {
        return ResponseEntity.ok(ApiResponse.success("Blog created", contentService.saveBlog(blog)));
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(@PathVariable Long id, @Valid @RequestBody Blog blog) {
        blog.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Blog updated", contentService.saveBlog(blog)));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        contentService.deleteBlog(id);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully", null));
    }

    // --- Gallery CRUD ---
    @GetMapping("/gallery")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> getAllGalleryItems() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllGalleryItems()));
    }

    @PostMapping("/gallery")
    public ResponseEntity<ApiResponse<GalleryItem>> createGalleryItem(@Valid @RequestBody GalleryItem item) {
        return ResponseEntity.ok(ApiResponse.success("Gallery item created", contentService.saveGalleryItem(item)));
    }

    @PutMapping("/gallery/{id}")
    public ResponseEntity<ApiResponse<GalleryItem>> updateGalleryItem(@PathVariable Long id, @Valid @RequestBody GalleryItem item) {
        item.setId(id);
        return ResponseEntity.ok(ApiResponse.success("Gallery item updated", contentService.saveGalleryItem(item)));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGalleryItem(@PathVariable Long id) {
        contentService.deleteGalleryItem(id);
        return ResponseEntity.ok(ApiResponse.success("Gallery item deleted successfully", null));
    }

    // --- Contact Messages ---
    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAllMessages()));
    }

    @PatchMapping("/messages/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(@PathVariable Long id) {
        contentService.markMessageAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contentService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted", null));
    }
}

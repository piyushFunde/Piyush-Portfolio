package com.piyush.cms.service;

import com.piyush.cms.model.*;
import com.piyush.cms.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContentService {

    private final AboutRepository aboutRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificateRepository certificateRepository;
    private final BlogRepository blogRepository;
    private final GalleryRepository galleryRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final MediaFileRepository mediaFileRepository;

    public ContentService(AboutRepository aboutRepository,
                          ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          ExperienceRepository experienceRepository,
                          CertificateRepository certificateRepository,
                          BlogRepository blogRepository,
                          GalleryRepository galleryRepository,
                          ContactMessageRepository contactMessageRepository,
                          MediaFileRepository mediaFileRepository) {
        this.aboutRepository = aboutRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.certificateRepository = certificateRepository;
        this.blogRepository = blogRepository;
        this.galleryRepository = galleryRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.mediaFileRepository = mediaFileRepository;
    }

    // --- About ---
    public About getAbout() {
        return aboutRepository.findAll().stream().findFirst().orElse(new About());
    }

    public About saveAbout(About about) {
        about.setUpdatedAt(LocalDateTime.now());
        return aboutRepository.save(about);
    }

    // --- Projects ---
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // --- Skills ---
    public List<Skill> getAllSkills() {
        return skillRepository.findAllByOrderByCategoryAscDisplayOrderAsc();
    }

    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryOrderByDisplayOrderAsc(category);
    }

    public Skill saveSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    // --- Experience ---
    public List<Experience> getAllExperience() {
        return experienceRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Experience saveExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }

    // --- Certificates ---
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Certificate saveCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }

    // --- Blogs ---
    public List<Blog> getPublishedBlogs() {
        return blogRepository.findByPublishedTrueOrderByPublishedAtDesc();
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Optional<Blog> getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug);
    }

    public Blog saveBlog(Blog blog) {
        if (blog.getPublishedAt() == null && blog.isPublished()) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    // --- Gallery ---
    public List<GalleryItem> getAllGalleryItems() {
        return galleryRepository.findAllByOrderByDisplayOrderAsc();
    }

    public GalleryItem saveGalleryItem(GalleryItem item) {
        return galleryRepository.save(item);
    }

    public void deleteGalleryItem(Long id) {
        galleryRepository.deleteById(id);
    }

    // --- Contact Messages ---
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage saveMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    public void markMessageAsRead(Long id) {
        contactMessageRepository.findById(id).ifPresent(msg -> {
            msg.setRead(true);
            contactMessageRepository.save(msg);
        });
    }

    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }

    public long getUnreadMessageCount() {
        return contactMessageRepository.countByIsReadFalse();
    }

    // --- Media Files ---
    public List<MediaFile> getAllMediaFiles() {
        return mediaFileRepository.findAllByOrderByUploadedAtDesc();
    }
}

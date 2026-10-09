package com.piyush.cms.config;

import com.piyush.cms.model.*;
import com.piyush.cms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AboutRepository aboutRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final ExperienceRepository experienceRepository;
    private final BlogRepository blogRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${cms.admin.username:${ADMIN_USERNAME:admin}}")
    private String defaultAdminUsername;

    @org.springframework.beans.factory.annotation.Value("${cms.admin.password:${ADMIN_PASSWORD:admin123}}")
    private String defaultAdminPassword;

    @org.springframework.beans.factory.annotation.Value("${cms.admin.email:${ADMIN_EMAIL:admin@piyushfunde.dev}}")
    private String defaultAdminEmail;

    public DataInitializer(UserRepository userRepository,
                           AboutRepository aboutRepository,
                           ProjectRepository projectRepository,
                           SkillRepository skillRepository,
                           CertificateRepository certificateRepository,
                           ExperienceRepository experienceRepository,
                           BlogRepository blogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.aboutRepository = aboutRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.certificateRepository = certificateRepository;
        this.experienceRepository = experienceRepository;
        this.blogRepository = blogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Admin User from Environment Variables / Config
        if (!userRepository.existsByUsername(defaultAdminUsername)) {
            User admin = new User(
                    defaultAdminUsername,
                    defaultAdminEmail,
                    passwordEncoder.encode(defaultAdminPassword),
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            System.out.println(">>> Seeded admin user: " + defaultAdminUsername);
        }

        // 2. Seed About Info
        if (aboutRepository.count() == 0) {
            About about = new About();
            about.setFullName("Piyush Funde");
            about.setTitle("Full Stack Developer & AI Engineer");
            about.setBio("Passionate software engineer crafting resilient distributed systems, scalable web applications, and intelligent AI-assisted workflows.");
            about.setLocation("India");
            about.setEmail("piyushfunde@example.com");
            about.setGithubUrl("https://github.com/piyushFunde");
            about.setLinkedinUrl("https://linkedin.com/in/piyushfunde");
            about.setTwitterUrl("https://twitter.com");
            about.setResumeUrl("#");
            about.setAvatarUrl("/profile.jpg");
            about.setInterests("Distributed Systems, LLM Orchestration, Cloud Architecture, Open Source");
            aboutRepository.save(about);
            System.out.println(">>> Seeded About info");
        }

        // 3. Seed Projects
        if (projectRepository.count() == 0) {
            Project p1 = new Project();
            p1.setTitle("🩺 Bedside Bot");
            p1.setDescription("AI-powered hospital assistant designed to help bedridden patients using real-time gesture recognition, voice commands, and emotion detection.");
            p1.setScreenshotUrl("/BedsideBot.png");
            p1.setTech(Arrays.asList("Python", "Flask", "OpenCV", "Mediapipe", "DeepFace"));
            p1.setLiveUrl("#");
            p1.setCodeUrl("https://github.com/piyushFunde/Bedsidebot_app");
            p1.setFeatured(true);
            p1.setDisplayOrder(1);

            Project p2 = new Project();
            p2.setTitle("⚙️ Visual Pipeline Engine");
            p2.setDescription("Drag-and-drop pipeline builder that allows users to create, validate, and execute Directed Acyclic Graph (DAG)-based workflows with Spring Boot & React Flow.");
            p2.setScreenshotUrl("/VisualPipelineEngine.png");
            p2.setTech(Arrays.asList("React", "React Flow", "Java", "Spring Boot", "Spring Data JPA"));
            p2.setLiveUrl("#");
            p2.setCodeUrl("https://github.com/piyushFunde/Visual-Pipeline-Engine");
            p2.setFeatured(true);
            p2.setDisplayOrder(2);

            Project p3 = new Project();
            p3.setTitle("🐞 BugFix AI");
            p3.setDescription("AI-powered bug analysis and fix suggestion system that automatically analyzes bug reports from issue trackers and generates code recommendations.");
            p3.setScreenshotUrl("/BugFixAI.png");
            p3.setTech(Arrays.asList("Java", "Spring Boot", "REST API", "AI/LLM", "PostgreSQL"));
            p3.setLiveUrl("https://bugfix-ai-backend-odli.onrender.com/");
            p3.setCodeUrl("https://github.com/piyushFunde/BugFix-Ai");
            p3.setFeatured(true);
            p3.setDisplayOrder(3);

            Project p4 = new Project();
            p4.setTitle("💰 Expense Tracker");
            p4.setDescription("A desktop-based financial tracking application that helps users record, categorize, and analyze spending with interactive data visualization.");
            p4.setScreenshotUrl("/expense.png");
            p4.setTech(Arrays.asList("Python", "Tkinter", "SQLite"));
            p4.setLiveUrl("#");
            p4.setCodeUrl("https://github.com/piyushFunde/expense-tracker");
            p4.setFeatured(false);
            p4.setDisplayOrder(4);

            projectRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            System.out.println(">>> Seeded initial projects");
        }

        // 4. Seed Skills
        if (skillRepository.count() == 0) {
            List<Skill> skills = Arrays.asList(
                    new Skill("Java", "Languages", "SiJava", 90, 1),
                    new Skill("Python", "Languages", "SiPython", 85, 2),
                    new Skill("JavaScript / TypeScript", "Languages", "SiJavascript", 88, 3),
                    new Skill("Spring Boot", "Frameworks & Libraries", "SiSpringboot", 90, 1),
                    new Skill("React.js", "Frameworks & Libraries", "SiReact", 88, 2),
                    new Skill("Node.js", "Frameworks & Libraries", "SiNodedotjs", 80, 3),
                    new Skill("Docker", "Developer Tools", "SiDocker", 82, 1),
                    new Skill("Git & GitHub", "Developer Tools", "SiGithub", 92, 2),
                    new Skill("PostgreSQL / MySQL", "Developer Tools", "SiPostgresql", 85, 3),
                    new Skill("OOP & Design Patterns", "Core Concepts", "SiDiagramsdotnet", 92, 1),
                    new Skill("Data Structures & Algorithms", "Core Concepts", "SiCodeforces", 88, 2),
                    new Skill("RESTful APIs & Microservices", "Core Concepts", "SiFastapi", 90, 3)
            );
            skillRepository.saveAll(skills);
            System.out.println(">>> Seeded skills list");
        }

        // 5. Seed Experience
        if (experienceRepository.count() == 0) {
            Experience exp = new Experience();
            exp.setCompany("Tech Innovation Lab");
            exp.setRole("Full Stack Engineering Intern");
            exp.setLocation("Remote");
            exp.setStartDate("Jan 2024");
            exp.setEndDate("Present");
            exp.setCurrent(true);
            exp.setDescription("Architected full-stack web applications and microservices using Spring Boot and React.");
            exp.setAchievements(Arrays.asList(
                    "Implemented secure JWT authentication and role-based access control.",
                    "Optimized database queries decreasing response times by 35%."
            ));
            exp.setDisplayOrder(1);
            experienceRepository.save(exp);
            System.out.println(">>> Seeded Experience");
        }

        // 6. Seed Sample Blog
        if (blogRepository.count() == 0) {
            Blog blog = new Blog();
            blog.setTitle("Architecting a Custom Headless CMS with Spring Boot 3 & Next.js");
            blog.setSlug("architecting-custom-headless-cms-spring-boot");
            blog.setExcerpt("A deep-dive into creating your own decoupled content management engine with Spring Data JPA and token-based security.");
            blog.setContent("Building your own custom CMS gives you 100% control over schemas, data ownership, and performance without third-party vendor lock-in...");
            blog.setCoverImage("/portfolio.jpg");
            blog.setTags(Arrays.asList("Java", "Spring Boot", "Architecture", "CMS"));
            blog.setPublished(true);
            blog.setReadTime("6 min read");
            blog.setPublishedAt(LocalDateTime.now());
            blogRepository.save(blog);
            System.out.println(">>> Seeded initial blog post");
        }
    }
}

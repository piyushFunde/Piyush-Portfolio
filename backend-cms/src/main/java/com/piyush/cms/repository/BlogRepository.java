package com.piyush.cms.repository;

import com.piyush.cms.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByPublishedTrueOrderByPublishedAtDesc();
    Optional<Blog> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

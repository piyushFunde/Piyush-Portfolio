package com.piyush.cms.repository;

import com.piyush.cms.model.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findAllByOrderByDisplayOrderAsc();
    List<GalleryItem> findByCategoryOrderByDisplayOrderAsc(String category);
}

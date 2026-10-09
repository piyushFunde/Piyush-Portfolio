package com.piyush.cms.repository;

import com.piyush.cms.model.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    List<MediaFile> findAllByOrderByUploadedAtDesc();
}

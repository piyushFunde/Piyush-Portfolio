package com.piyush.cms.service;

import com.piyush.cms.model.MediaFile;
import com.piyush.cms.repository.MediaFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final MediaFileRepository mediaFileRepository;

    public FileStorageService(@Value("${cms.upload.dir:./uploads}") String uploadDir,
                              MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where uploaded files will be stored.", ex);
        }
    }

    public MediaFile storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + originalFileName);
            }

            String extension = "";
            int extIndex = originalFileName.lastIndexOf(".");
            if (extIndex > 0) {
                extension = originalFileName.substring(extIndex);
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + uniqueFilename;
            MediaFile mediaFile = new MediaFile(
                    uniqueFilename,
                    originalFileName,
                    file.getContentType(),
                    file.getSize(),
                    fileUrl
            );

            return mediaFileRepository.save(mediaFile);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}

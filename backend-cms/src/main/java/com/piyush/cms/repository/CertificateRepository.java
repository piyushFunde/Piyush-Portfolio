package com.piyush.cms.repository;

import com.piyush.cms.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findAllByOrderByDisplayOrderAsc();
}

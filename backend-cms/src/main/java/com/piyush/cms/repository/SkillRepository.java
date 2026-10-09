package com.piyush.cms.repository;

import com.piyush.cms.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByCategoryAscDisplayOrderAsc();
    List<Skill> findByCategoryOrderByDisplayOrderAsc(String category);
}

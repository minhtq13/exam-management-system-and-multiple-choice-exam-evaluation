package com.elearning.elearning_support.repositories.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elearning.elearning_support.entities.test.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

}

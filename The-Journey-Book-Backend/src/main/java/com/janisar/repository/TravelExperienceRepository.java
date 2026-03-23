package com.janisar.repository;

import com.janisar.entity.TravelExperience;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelExperienceRepository extends MongoRepository<TravelExperience, String> {

    // Find experiences by user ID
    List<TravelExperience> findByUserId(String userId);

    // Find experiences by location (partial match)
    List<TravelExperience> findByLocationContainingIgnoreCase(String location);

    // Find experiences by tags
    List<TravelExperience> findByTagsContaining(String tag);

    // Get latest experiences
    List<TravelExperience> findAllByOrderByCreatedAtDesc();
}
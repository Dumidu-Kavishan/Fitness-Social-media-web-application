package com.PAF.HealthHubAPI.repository.Post;

import com.PAF.HealthHubAPI.model.Post.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.UUID;

@Repository
public interface PostRepo extends MongoRepository<Post, UUID>
{
    ArrayList<Post> findAll();
    Post save(Post post);
    void deleteById(UUID postId);
    ArrayList<Post> findByUserId(String userId);
    Post findByPostId(UUID postId);
}

package com.PAF.HealthHubAPI.repository.Post;

import com.PAF.HealthHubAPI.model.Post.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;
import java.util.UUID;

public interface CommentRepo extends MongoRepository<Comment, String> {

    Comment save(Comment comment);

    //get all comment for one postId
    ArrayList<Comment> findAllByPostId(UUID postId);


}

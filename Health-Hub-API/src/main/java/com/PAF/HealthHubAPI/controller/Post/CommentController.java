package com.PAF.HealthHubAPI.controller.Post;

import com.PAF.HealthHubAPI.model.Post.Comment;
import com.PAF.HealthHubAPI.service.Post.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/commentService")
public class CommentController {

    @Autowired
    CommentService commentService;

    @PostMapping("/save")
    public Comment saveComment(@RequestBody Comment comment)
    {
        return commentService.saveComment(comment);
    }

    //get all comment for one postId
    @GetMapping("/getAllComments/{postId}")
    public ArrayList<Comment> getAllComments(@PathVariable("postId") UUID postId)
    {
        return commentService.getAllComments(postId);
    }


}

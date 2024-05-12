package com.PAF.HealthHubAPI.repository.Workoutplan;


import com.PAF.HealthHubAPI.model.Workoutplan.WorkplanComment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;
import java.util.UUID;

public interface WorkplanCommentRepo extends MongoRepository<WorkplanComment, String> {

    WorkplanComment save(WorkplanComment workplanComment);

    //get all comment for one postId
    ArrayList<WorkplanComment> findAllByplanId(UUID planId);
}
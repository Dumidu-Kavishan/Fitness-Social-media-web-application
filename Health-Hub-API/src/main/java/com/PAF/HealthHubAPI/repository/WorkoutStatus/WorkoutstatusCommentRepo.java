package com.PAF.HealthHubAPI.repository.WorkoutStatus;

import com.PAF.HealthHubAPI.model.WorkoutStatus.WorkoutstatusComment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;
import java.util.UUID;

public interface WorkoutstatusCommentRepo extends MongoRepository<WorkoutstatusComment, String> {

    WorkoutstatusComment save(WorkoutstatusComment workoutstatusComment);

    ArrayList<WorkoutstatusComment> findAllBystatusId(UUID statusId);
}

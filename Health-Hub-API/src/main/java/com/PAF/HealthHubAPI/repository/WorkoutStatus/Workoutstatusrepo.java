package com.PAF.HealthHubAPI.repository.WorkoutStatus;

import com.PAF.HealthHubAPI.model.WorkoutStatus.Workoutstatus;
import com.PAF.HealthHubAPI.model.Workoutplan.Workplan;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.ArrayList;
import java.util.UUID;

public interface Workoutstatusrepo extends MongoRepository<Workoutstatus, UUID>
{
    ArrayList<Workoutstatus> findAll();
    Workoutstatus save(Workoutstatus workoutstatus);
    void deleteById(UUID statusId);
    ArrayList<Workoutstatus> findByUserId(String userId);
    Workoutstatus findByStatusId(UUID statusId);
}

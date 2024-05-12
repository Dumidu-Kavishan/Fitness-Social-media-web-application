package com.PAF.HealthHubAPI.service.WorkoutStatus;

import com.PAF.HealthHubAPI.model.WorkoutStatus.Workoutstatus;
import com.PAF.HealthHubAPI.model.Workoutplan.Workplan;
import com.PAF.HealthHubAPI.repository.WorkoutStatus.Workoutstatusrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class WorkoutstatusService {

    @Autowired
    Workoutstatusrepo workoutstatusrepo;


    public ArrayList<Workoutstatus> submitWorkoutstatusToDB(Workoutstatus postData)
    {
        // Set creation timestamp
        LocalDateTime datetime = LocalDateTime.now();

        //set random post id ,likes and date & time
        postData.setStatusId(UUID.randomUUID());
        postData.setLikes(0);
        postData.setDateTime(datetime);


        workoutstatusrepo.save(postData);

        ArrayList<Workoutstatus> result = retrieveWorkoutstatusFromDB();
        return result;
    }
    public ArrayList<Workoutstatus> retrieveWorkoutstatusFromDB()
    {
        ArrayList<Workoutstatus> result = workoutstatusrepo.findAll();
        return result;

    }
    public ArrayList<Workoutstatus> deleteWorkoutstatusFromDB(UUID statusId)
    {
        workoutstatusrepo.deleteById(statusId);
        ArrayList<Workoutstatus> result = retrieveWorkoutstatusFromDB();
        return result;
    }
    public ArrayList<Workoutstatus> retrieveOneUserPostFromDB(String userId)
    {
        ArrayList<Workoutstatus> result = workoutstatusrepo.findByUserId(userId);
        return result;

    }

    public Workoutstatus updateworkoutstatus(UUID statusId,Workoutstatus newworkoutstatus)
    {
        Workoutstatus workoutstatus = workoutstatusrepo.findByStatusId(statusId);

        workoutstatus.setDescription(newworkoutstatus.getDescription());
        workoutstatus.setBurncalories(newworkoutstatus.getBurncalories());
        workoutstatus.setTopic(newworkoutstatus.getTopic());
        workoutstatus.setWorkoutstatusImgURL(newworkoutstatus.getWorkoutstatusImgURL());
        workoutstatus.setWorkouttime(newworkoutstatus.getWorkouttime());
        workoutstatus.setWorkouttype(newworkoutstatus.getWorkouttype());



        return workoutstatusrepo.save(workoutstatus);
    }
}

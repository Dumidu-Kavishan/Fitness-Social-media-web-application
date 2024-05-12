package com.PAF.HealthHubAPI.service.Mealplan;

import com.PAF.HealthHubAPI.model.Mealplan.MealComment;
import com.PAF.HealthHubAPI.repository.Mealplan.MealCommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class MealCommentService {

    @Autowired
    MealCommentRepo mealCommentRepo;

    public MealComment saveMealComment(MealComment mealComment)
    {
        // Set creation timestamp
        LocalDateTime datetime = LocalDateTime.now();


        mealComment.setDateTime(datetime);
        return mealCommentRepo.save(mealComment);
    }

    //get all comment for one postId
    public ArrayList<MealComment> getAllMealComments(UUID mealId)
    {
        return mealCommentRepo.findAllByMealId(mealId);
    }
}

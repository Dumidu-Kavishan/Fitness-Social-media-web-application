package com.PAF.HealthHubAPI.repository.User;


import com.PAF.HealthHubAPI.model.User.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;


@Repository
public interface UserRepo extends MongoRepository<User, String>
{
    User save(User user);
    ArrayList<User> findAll();
    User findAllByUserId(String userId);


}

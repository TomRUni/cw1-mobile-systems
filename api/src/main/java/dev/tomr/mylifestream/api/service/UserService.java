package dev.tomr.mylifestream.api.service;

import dev.tomr.mylifestream.api.model.User;
import dev.tomr.mylifestream.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public String getUserIdFromName(String name) {
        User user = userRepository.findUserByUsername(name);
        return user.getId().toString();
    }
}

package com.crud.hello1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserEntityService {

    @Autowired
    private UserEntityRepo userEntityRepo;

    public UserEntity addUserEntity(UserEntity userEntity) {
        return userEntityRepo.save(userEntity);
    }

    @SuppressWarnings("unchecked")
    public List<UserEntity> getAllUserEntity() {
        return (List<UserEntity>) userEntityRepo.findAll();
    }

    public UserEntity updateUserEntity(UserEntity updatedUserEntity) {
        Optional<UserEntity> userEntity = Optional.ofNullable(userEntityRepo.findById(updatedUserEntity.getId()));
        if (userEntity.isPresent()) {
            UserEntity existingUser = userEntity.get();
            existingUser.setUsername(updatedUserEntity.getUsername());
            existingUser.setPassword(updatedUserEntity.getPassword());
            return userEntityRepo.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id: " + updatedUserEntity.getId());
        }
    }

    public Boolean deleteUserEntity(int id) {
        userEntityRepo.deleteById(id);
        return true;
    }
}

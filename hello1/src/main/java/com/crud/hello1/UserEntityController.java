package com.crud.hello1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserEntityController {

    @Autowired
    private UserEntityService userEntityService;

    @PostMapping("/addUserEntity")
    public UserEntity addUserEntity(@RequestBody UserEntity userEntity) {
        return userEntityService.addUserEntity(userEntity);
    }

    @GetMapping("/getUserEntity")
    public List<UserEntity> getAllUserEntity() {
        return userEntityService.getAllUserEntity();
    }

    @PostMapping("/updateUserEntity")
    public UserEntity updateUserEntity(@RequestBody UserEntity userEntity) {
        return userEntityService.updateUserEntity(userEntity);
    }

    @DeleteMapping("/deleteUserEntity/{id}")
    public Boolean deleteUserEntity(@PathVariable int id) {
        return userEntityService.deleteUserEntity(id);
    }
}

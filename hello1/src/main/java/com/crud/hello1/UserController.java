package com.crud.hello1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Show the signup form
    @GetMapping("/signup")
    public String showSignupForm(Model model) {
        return "signup"; // Thymeleaf template for signup
    }

    // Handle user registration
    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user) {
        userService.saveUser(user);
        return "redirect:/users"; // Redirect to user management page after signup
    }

    // Fetch all users and display on the page
    @GetMapping("/users")
    public String listUsers(Model model) {
        List<User> users = userService.getAllUsers();  // Fetch users
        model.addAttribute("users", users);  // Add users to the model
        return "users";  // Return the Thymeleaf template
    }
    
    

    // Show the edit user form
    @GetMapping("/edit/{id}")
    public String editUser(@PathVariable Long id, Model model) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            model.addAttribute("user", user.get());
            return "edit-user";  // Thymeleaf template for editing user
        } else {
            return "redirect:/users"; // Redirect if user not found
        }
    }

    // Handle user update
    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable Long id, @ModelAttribute User user) {
        user.setId(id); // Set the ID for the user to update
        userService.saveUser(user); // Save the updated user
        return "redirect:/users"; // Redirect to user management page after update
    }

    // Handle user deletion
    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id); // Delete the user by ID
        return "redirect:/users"; // Redirect to user management page after deletion
    }
    
    
}

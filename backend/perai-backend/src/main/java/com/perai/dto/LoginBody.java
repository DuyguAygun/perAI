package com.perai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginBody {

    @NotNull(message = "Email can not be null")
    @NotBlank(message = "Email can not be blank")
    @Email(message = "You should enter an email")
    private String email;

    @NotNull(message = "Password can not be null")
    @NotBlank(message = "Password can not be blank")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
            message = "Minimum eight characters, at least one letter and one number"
    )
    private String password;
}
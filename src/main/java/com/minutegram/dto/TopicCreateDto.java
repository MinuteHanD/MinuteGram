package com.minutegram.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class TopicCreateDto {
    @NotBlank(message = "Topic name cannot be blank")
    @Size(max = 50, message = "Topic name must not exceed 50 characters")
    private String name;
    @Size(max = 250, message = "Description must not exceed 250 characters")
    private String description;

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }
}

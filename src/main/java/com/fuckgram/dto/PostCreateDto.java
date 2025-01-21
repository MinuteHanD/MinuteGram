package com.fuckgram.dto;

public class PostCreateDto {
    private String content;
    private String title;
    private String topicName;

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getContent(){

        return content;
    }

    public void setContent(String content){

        this.content = content;
    }

    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }
}

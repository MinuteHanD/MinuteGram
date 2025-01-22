package com.fuckgram.controller;


import com.fuckgram.dto.CommentCreateDto;
import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentCreateDto commentDto){
        CommentResponseDto comment = commentService.createComment(commentDto);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getPostComments(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getPostComments(postId);
        return ResponseEntity.ok(comments);
    }

}

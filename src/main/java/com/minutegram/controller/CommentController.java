package com.minutegram.controller;


import com.minutegram.dto.CommentCreateDto;
import com.minutegram.dto.CommentResponseDto;
import com.minutegram.service.CommentService;
import jakarta.validation.Valid;
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
    public ResponseEntity<CommentResponseDto> createComment(@Valid @RequestBody CommentCreateDto commentDto){
        CommentResponseDto comment = commentService.createComment(commentDto);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getPostComments(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getPostComments(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentResponseDto>> getCommentReplies(@PathVariable Long commentId) {
        List<CommentResponseDto> replies = commentService.getCommentReplies(commentId);
        return ResponseEntity.ok(replies);
    }


}

package com.fuckgram.service;


import com.fuckgram.dto.CommentCreateDto;
import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.entity.Comment;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.CommentRepository;
import com.fuckgram.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    public CommentResponseDto createComment(CommentCreateDto commentDto){
        User currentUser = userService.getCurrentUser();

        Post post = postRepository.findById(commentDto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);

        if (commentDto.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentDto.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);
        return CommentResponseDto.fromEntity(savedComment);
    }

    public List<CommentResponseDto> getPostComments(Long postId){
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(CommentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }


}

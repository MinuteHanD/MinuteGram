package com.minutegram.service;


import com.minutegram.dto.CommentCreateDto;
import com.minutegram.dto.CommentResponseDto;
import com.minutegram.entity.Comment;
import com.minutegram.entity.Post;
import com.minutegram.entity.User;
import com.minutegram.repository.CommentRepository;
import com.minutegram.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional // Use Spring's Transactional annotation
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
        // Using fromEntity here is fine because it's a single object, not a list.
        return CommentResponseDto.fromEntity(savedComment);
    }

    /**
     * REWRITTEN FOR PERFORMANCE.
     * Fetches all comments for a post in a single query and then assembles the reply hierarchy in memory.
     * @param postId The ID of the post.
     * @return A list of top-level comment DTOs, with nested replies.
     */
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getPostComments(Long postId) {
        // Step 1: Fetch ALL comment DTOs for the post in ONE efficient query.
        List<CommentResponseDto> allCommentDtos = commentRepository.findDtosByPostId(postId);

        // Step 2: Create a map for quick access to each comment by its ID.
        Map<Long, CommentResponseDto> commentMap = allCommentDtos.stream()
                .collect(Collectors.toMap(CommentResponseDto::getId, comment -> comment));

        // Step 3: Assemble the hierarchy.
        List<CommentResponseDto> topLevelComments = new ArrayList<>();
        for (CommentResponseDto commentDto : allCommentDtos) {
            // Check if the comment is a reply.
            if (commentDto.getParentCommentId() != null) {
                CommentResponseDto parent = commentMap.get(commentDto.getParentCommentId());
                if (parent != null) {
                    // It's a reply, so add it to its parent's list of replies.
                    parent.getReplies().add(commentDto);
                }
            } else {
                // It's a top-level comment.
                topLevelComments.add(commentDto);
            }
        }
        
        // Sort replies by creation date if needed (optional, adds minor overhead)
        for (CommentResponseDto parent : topLevelComments) {
            parent.getReplies().sort((r1, r2) -> r1.getCreatedAt().compareTo(r2.getCreatedAt()));
        }
        
        // Sort top-level comments by creation date (descending)
        topLevelComments.sort((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()));

        return topLevelComments;
    }


    /**
     * This method is now less efficient than getPostComments but can be kept for specific cases
     * where you only need the direct replies to a single known comment.
     */
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentReplies(Long parentCommentId) {
        return commentRepository.findByParentCommentIdOrderByCreatedAt(parentCommentId)
                .stream()
                .map(CommentResponseDto::fromEntity) // BEWARE: This causes N+1 on the author name for each reply.
                .collect(Collectors.toList());
    }

    /**
     * Used for the admin panel. This is still slow due to fromEntity.
     * It should also be converted to a projection if the admin panel comment view is slow.
     */
    @Transactional(readOnly = true)
    public Page<CommentResponseDto> getAllComments(Pageable pageable) {
        // TODO: Create a projection for this in CommentRepository to improve admin panel performance.
        return commentRepository.findAll(pageable).map(CommentResponseDto::fromEntity);
    }

}

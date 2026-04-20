package com.example.BeatAI.repository;

import com.example.BeatAI.entity.CommunityPost;
import com.example.BeatAI.entity.PostReaction;
import com.example.BeatAI.entity.ReactionType;
import com.example.BeatAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostAndUser(CommunityPost post, User user);

    long countByPostAndReactionType(CommunityPost post, ReactionType reactionType);

    List<PostReaction> findAllByPost(CommunityPost post);
}

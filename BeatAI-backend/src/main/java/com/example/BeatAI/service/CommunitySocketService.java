package com.example.BeatAI.service;

import com.example.BeatAI.dto.SocketEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommunitySocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNewPost(Object payload){
        messagingTemplate.convertAndSend(
          "/topic/community",
          new SocketEvent<>("NEW_POST", payload)
          );
    }

    public void sendReactionUpdate(Object payload){
      messagingTemplate.convertAndSend(
        "/topic/community/reaction",
        new SocketEvent<>("REACTION_UPDATED", payload)
      );
    }
}

package com.example.BeatAI.dto;

import lombok.Getter;

@Getter
public class DiaryStickerRequest {
    private String category;
    private String label;
    private String img;
    private Integer page;
}

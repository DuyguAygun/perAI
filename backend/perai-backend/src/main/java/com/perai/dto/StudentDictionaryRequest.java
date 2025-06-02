package com.perai.dto;

import com.perai.model.DictionaryErrorTag;
import com.perai.model.DictionaryLearningTag;
import com.perai.model.DictionaryTopicTag;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class StudentDictionaryRequest {
    private String word;
    private Long userId;
    private String mistakeDescription;
    private List<DictionaryTopicTag> topicTag;
    private DictionaryLearningTag learningTag;
    private List<DictionaryErrorTag> errorTag;
    private LocalDate date;
}
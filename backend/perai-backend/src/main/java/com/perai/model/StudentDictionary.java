package com.perai.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class StudentDictionary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String word;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String mistakeDescription;

    @ElementCollection(targetClass = DictionaryTopicTag.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "student_dictionary_topics", joinColumns = @JoinColumn(name = "student_dictionary_id"))
    @Column(name = "topic")
    private List<DictionaryTopicTag> topics;

    @Enumerated(EnumType.STRING)
    private DictionaryLearningTag learningTag;

    @ElementCollection(targetClass = DictionaryErrorTag.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "student_dictionary_error_tags", joinColumns = @JoinColumn(name = "student_dictionary_id"))
    @Column(name = "error_tag")
    private List<DictionaryErrorTag> errorTags;

    private LocalDate date;
}
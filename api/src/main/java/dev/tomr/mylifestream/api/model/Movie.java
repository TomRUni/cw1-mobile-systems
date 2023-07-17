package dev.tomr.mylifestream.api.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Movie {
    private @MongoId ObjectId id;
    private String userId;
    private String title;
    private String description;
    private String heroUri;
    private String videoUri;
}

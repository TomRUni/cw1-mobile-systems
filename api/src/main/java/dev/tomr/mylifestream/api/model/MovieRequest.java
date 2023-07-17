package dev.tomr.mylifestream.api.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieRequest {
    @NotNull
    private String title;
    private String description;
}

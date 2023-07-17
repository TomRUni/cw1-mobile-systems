package dev.tomr.mylifestream.api.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MoviesResponse {
    List<Movie> movies;
}

package dev.tomr.mylifestream.api.repository;

import dev.tomr.mylifestream.api.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MovieRepository extends MongoRepository<Movie, String> {
    @Query("{userId:'?0'}")
    List<Movie> findMoviesByUserId(String userId);

}

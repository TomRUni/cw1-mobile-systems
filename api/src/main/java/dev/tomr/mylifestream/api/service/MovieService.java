package dev.tomr.mylifestream.api.service;

import dev.tomr.mylifestream.api.model.Movie;
import dev.tomr.mylifestream.api.model.MovieRequest;
import dev.tomr.mylifestream.api.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    MovieRepository movieRepository;

    public List<Movie> getMoviesFromUserId(String userId) {
        return movieRepository.findMoviesByUserId(userId);
    }

    public Movie insertNewMovieInfo(MovieRequest movieRequest, String userId) {
        Movie movie = Movie.builder()
                .title(movieRequest.getTitle())
                .description(movieRequest.getDescription())
                .userId(userId)
                .build();
        return movieRepository.save(movie);
    }

    public Movie addMovieUri(String uri, String userId, String movieId) throws Exception {
        try {
            Movie movie = movieRepository.findById(movieId).get();
            if (movie.getUserId().equals(userId)) {
                movie.setVideoUri(uri);
                return movieRepository.save(movie);
            } else {
                throw new Exception();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Movie addHeroUri(String uri, String userId, String movieId) throws Exception {
        try {
            Movie movie = movieRepository.findById(movieId).get();
            if (movie.getUserId().equals(userId)) {
                movie.setHeroUri(uri);
                return movieRepository.save(movie);
            } else {
                throw new Exception();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}

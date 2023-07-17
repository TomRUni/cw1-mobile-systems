package dev.tomr.mylifestream.api.controller;

import dev.tomr.mylifestream.api.model.Movie;
import dev.tomr.mylifestream.api.model.MovieRequest;
import dev.tomr.mylifestream.api.model.MoviesResponse;
import dev.tomr.mylifestream.api.service.MongoAuthUserDetailService;
import dev.tomr.mylifestream.api.service.MovieService;
import dev.tomr.mylifestream.api.service.S3Service;
import dev.tomr.mylifestream.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    UserService userService;

    @Autowired
    MovieService movieService;

    @Autowired
    S3Service s3Service;

    @GetMapping("")
    public ResponseEntity<MoviesResponse> getUserMovies(Principal principal) {
        String userId = userService.getUserIdFromName(principal.getName());
        List<Movie> movieList = movieService.getMoviesFromUserId(userId);

        return new ResponseEntity<>(new MoviesResponse(movieList), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> submitNewMovie(@RequestBody MovieRequest movieRequest, Principal principal) {
        String userId = userService.getUserIdFromName(principal.getName());
        Movie movie = movieService.insertNewMovieInfo(movieRequest, userId);
        return new ResponseEntity<>(movie.getId().toString(), HttpStatus.CREATED);
    }

    @PostMapping("{id}/upload")
    public ResponseEntity<Movie> uploadMovie(@RequestPart(value = "file")MultipartFile file, Principal principal, @PathVariable String id) throws Exception {
        String userId = userService.getUserIdFromName(principal.getName());
        String uri = s3Service.uploadFile(file);
        return new ResponseEntity<>(movieService.addMovieUri(uri, userId, id), HttpStatus.CREATED);
    }

    @PostMapping("{id}/hero/upload")
    public ResponseEntity<Movie> uploadImage(@RequestPart(value = "file")MultipartFile file, Principal principal, @PathVariable String id) throws Exception {
        String userId = userService.getUserIdFromName(principal.getName());
        String uri = s3Service.uploadFile(file);
        return new ResponseEntity<>(movieService.addHeroUri(uri, userId, id), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<MoviesResponse> searchMovies(@RequestParam String search, Principal principal) {
        String userId = userService.getUserIdFromName(principal.getName());
        List<Movie> movieList = movieService.getMoviesFromUserId(userId);
        MoviesResponse moviesResponse = new MoviesResponse(movieList.stream().filter(f -> f.getTitle().toLowerCase().contains(search.toLowerCase())).toList());
        return new ResponseEntity<>(moviesResponse, HttpStatus.OK);
    }
}

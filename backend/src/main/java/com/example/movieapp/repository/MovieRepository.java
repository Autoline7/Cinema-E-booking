package com.example.movieapp.repository;

import com.example.movieapp.model.Movie;
import com.example.movieapp.model.MPAARating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
    List<Movie> findByGenre(String genre);
    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByCastContainingIgnoreCase(String cast);
    List<Movie> findByDirectorContainingIgnoreCase(String director);
    List<Movie> findByProducerContainingIgnoreCase(String producer);
    List<Movie> findByMpaa(MPAARating mpaa); // Fix: Use Enum instead of String
    Optional<Movie> findFirstByTitleContainingIgnoreCase(String title); // Optimized for single result

    @Query("SELECT m FROM Movie m WHERE " +
            "(:id IS NULL OR m.id = :id) AND " +
            "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:genre IS NULL OR LOWER(m.genre) LIKE LOWER(CONCAT('%', :genre, '%'))) AND " +
            "(:cast IS NULL OR LOWER(m.cast) LIKE LOWER(CONCAT('%', :cast, '%'))) AND " +
            "(:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%'))) AND " +
            "(:producer IS NULL OR LOWER(m.producer) LIKE LOWER(CONCAT('%', :producer, '%'))) AND " +
            "(:mpaa IS NULL OR m.mpaa = :mpaa)")
    List<Movie> searchMovies(
            @Param("id") Integer id,
            @Param("title") String title,
            @Param("genre") String genre,
            @Param("cast") String cast,
            @Param("director") String director,
            @Param("producer") String producer,
            @Param("mpaa") MPAARating mpaa
    );
}

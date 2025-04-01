package com.example.movieapp.model;

import jakarta.persistence.*; 
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;
import com.example.movieapp.model.MPAARating;

@Entity
@Table(name = "movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String genre;
    private String cast;
    private String director;
    private String producer;
    private String synopsis;
    private String picture;
    private String video;

    @Enumerated(EnumType.STRING)
    private MPAARating mpaa;

    @Transient
    private List<String> castList; 

    @Transient
    private List<String> directorList;  

    @Transient
    private List<String> producerList;

    @Transient
    private List<Review> reviews; 

    public Movie() {}

    public Movie(String title, String genre, String cast, String director,
                 String producer, String synopsis, String picture,
                 String video, MPAARating mpaa) {
        this.title = title;
        this.genre = genre;
        this.cast = cast;
        this.director = director;
        this.producer = producer;
        this.synopsis = synopsis;
        this.picture = picture;
        this.video = video;
        this.mpaa = mpaa;
    }

    @PostLoad
    private void parseCastAndDirectorAndProducer() {
        if (this.cast != null) {
            this.castList = Arrays.stream(this.cast.split(", "))
                                  .map(String::trim)
                                  .collect(Collectors.toList());
        }
        if (this.director != null) {
            this.directorList = Arrays.stream(this.director.split(", "))
                                      .map(String::trim)
                                      .collect(Collectors.toList());
        }
        if (this.producer != null) {
            this.producerList = Arrays.stream(this.producer.split(", "))
                                      .map(String::trim)
                                      .collect(Collectors.toList());
        }
    }

    public List<String> getProducerList() {
        return producerList;
    }

    public List<String> getCastList() {
        return castList;
    }

    public List<String> getDirectorList() {
        return directorList;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDirector() {
        return director;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCast() {
        return cast;
    }

    public void setCast(String cast) {
        this.cast = cast;
        parseCastAndDirectorAndProducer(); 
    }

    public void setDirector(String director) {
        this.director = director;
        parseCastAndDirectorAndProducer();
    }

    public void setProducer(String producer) {
        this.producer = producer;
        parseCastAndDirectorAndProducer(); 
    }

    public String getProducer() {
        return producer;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public MPAARating getMpaa() {
        return mpaa;
    }

    public void setMpaa(MPAARating mpaa) {
        this.mpaa = mpaa;
    }
}
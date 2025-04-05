package com.example.movieapp.repository;

import com.example.movieapp.model.Showroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowroomRepository extends JpaRepository<Showroom, Integer> {
}
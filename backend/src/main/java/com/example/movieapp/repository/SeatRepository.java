package com.example.movieapp.repository;

import com.example.movieapp.model.Seat;
import com.example.movieapp.model.Showroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByShowroom(Showroom showroom);
    List<Seat> findByShowroomShowroomId(int showroomId);
}

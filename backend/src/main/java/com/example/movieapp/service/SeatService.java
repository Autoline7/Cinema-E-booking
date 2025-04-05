package com.example.movieapp.service;

import com.example.movieapp.model.Seat;
import com.example.movieapp.model.Showroom;
import com.example.movieapp.repository.SeatRepository;
import com.example.movieapp.repository.ShowroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ShowroomRepository showroomRepository;

    public SeatService(SeatRepository seatRepository, ShowroomRepository showroomRepository) {
        this.seatRepository = seatRepository;
        this.showroomRepository = showroomRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Optional<Seat> getSeatById(int id) {
        return seatRepository.findById(id);
    }

    public List<Seat> getSeatsByShowroomId(int showroomId) {
        return seatRepository.findByShowroomShowroomId(showroomId);
    }

    public Seat addSeat(int showroomId, Seat seat) {
        Showroom showroom = showroomRepository.findById(showroomId)
                .orElseThrow(() -> new IllegalArgumentException("Showroom not found"));
        seat.setShowroom(showroom);
        return seatRepository.save(seat);
    }

    public boolean deleteSeat(int id) {
        if (seatRepository.existsById(id)) {
            seatRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

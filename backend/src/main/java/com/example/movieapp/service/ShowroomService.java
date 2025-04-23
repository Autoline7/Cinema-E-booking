package com.example.movieapp.service;

import com.example.movieapp.model.Showroom;
import com.example.movieapp.repository.ShowroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShowroomService {

    private final ShowroomRepository showroomRepository;

    public ShowroomService(ShowroomRepository showroomRepository) {
        this.showroomRepository = showroomRepository;
    }

    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }

    public Optional<Showroom> getShowroomById(int id) {
        return showroomRepository.findById(id);
    }

    public Showroom addShowroom(Showroom showroom) {
        return showroomRepository.save(showroom);
    }

    public boolean deleteShowroom(int id) {
        if (showroomRepository.existsById(id)) {
            showroomRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
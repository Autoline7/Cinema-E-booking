package com.example.movieapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "showroom")
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int showroomId;

    @Column(name = "seat_capacity", nullable = false)
    private int seatCapacity;

    // Constructors
    public Showroom() {}

    public Showroom(int seatCapacity) {
        this.seatCapacity = seatCapacity;
    }

    // Getters and Setters
    public int getShowroomId() {
        return showroomId;
    }

    public void setShowroomId(int showroomId) {
        this.showroomId = showroomId;
    }

    public int getSeatCapacity() {
        return seatCapacity;
    }

    public void setSeatCapacity(int seatCapacity) {
        this.seatCapacity = seatCapacity;
    }
}
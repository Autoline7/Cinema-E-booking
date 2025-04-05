package com.example.movieapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int seatId;

    @ManyToOne
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @Column(name = "seat_number", length = 10, nullable = false)
    private String seatNumber;

    @Column(name = "row_number", nullable = false)
    private int rowNumber;

    @Column(name = "column_number", nullable = false)
    private int columnNumber;

    public Seat() {}

    public Seat(Showroom showroom, String seatNumber, int rowNumber, int columnNumber) {
        this.showroom = showroom;
        this.seatNumber = seatNumber;
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }

    public Showroom getShowroom() {
        return showroom;
    }

    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }

    public int getColumnNumber() {
        return columnNumber;
    }

    public void setColumnNumber(int columnNumber) {
        this.columnNumber = columnNumber;
    }
}

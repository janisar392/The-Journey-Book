package com.janisar.dto;

import java.time.LocalDate;

public class SearchRequest {
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private int travelers;

    // Default constructor (necessary for Spring)
    public SearchRequest() {}

    // Getters and Setters
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }

    @Override
    public String toString() {
        return "SearchRequest{" +
                "location='" + location + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", travelers=" + travelers +
                '}';
    }
}
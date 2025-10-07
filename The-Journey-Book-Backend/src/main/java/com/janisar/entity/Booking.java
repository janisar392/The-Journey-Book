package com.janisar.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String bookingId; // Frontend generated ID like "BK123456789"
    private String userId; // Reference to User who made booking
    private String experienceId;
    private String experienceName;
    private String experienceImage;
    private String location;
    private String duration;

    private String selectedDate; // Experience date
    private Map<String, Integer> ticketQuantities; // {adult: 2, child: 1, senior: 0}
    private Double totalPrice;

    // Guest information
    private String guestFullName;
    private String guestEmail;
    private String guestPhone;
    private String specialRequests;

    // Payment details
    private String paymentMethod; // "online" or "venue"
    private String paymentId; // Razorpay payment ID for online payments
    private String paymentStatus; // "pending", "completed", "failed"

    // Booking status
    private String status; // "confirmed", "pending_payment", "completed", "cancelled"

    private LocalDateTime bookingDate; // When booking was made
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Booking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Booking(String bookingId, String userId, String experienceId, String experienceName,
                   String experienceImage, String location, String duration, String selectedDate,
                   Map<String, Integer> ticketQuantities, Double totalPrice, String guestFullName,
                   String guestEmail, String guestPhone, String paymentMethod, String status) {
        this();
        this.bookingId = bookingId;
        this.userId = userId;
        this.experienceId = experienceId;
        this.experienceName = experienceName;
        this.experienceImage = experienceImage;
        this.location = location;
        this.duration = duration;
        this.selectedDate = selectedDate;
        this.ticketQuantities = ticketQuantities;
        this.totalPrice = totalPrice;
        this.guestFullName = guestFullName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.paymentMethod = paymentMethod;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getExperienceId() { return experienceId; }
    public void setExperienceId(String experienceId) { this.experienceId = experienceId; }

    public String getExperienceName() { return experienceName; }
    public void setExperienceName(String experienceName) { this.experienceName = experienceName; }

    public String getExperienceImage() { return experienceImage; }
    public void setExperienceImage(String experienceImage) { this.experienceImage = experienceImage; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getSelectedDate() { return selectedDate; }
    public void setSelectedDate(String selectedDate) { this.selectedDate = selectedDate; }

    public Map<String, Integer> getTicketQuantities() { return ticketQuantities; }
    public void setTicketQuantities(Map<String, Integer> ticketQuantities) { this.ticketQuantities = ticketQuantities; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getGuestFullName() { return guestFullName; }
    public void setGuestFullName(String guestFullName) { this.guestFullName = guestFullName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
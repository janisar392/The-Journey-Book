package com.janisar.controller;

import com.janisar.entity.Booking;
import com.janisar.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Get all bookings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get booking by booking ID
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable String bookingId) {
        Optional<Booking> booking = bookingService.getBookingByBookingId(bookingId);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Booking not found");
            return ResponseEntity.notFound().build();
        }
    }

    // Get upcoming bookings for a user
    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookings(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getUpcomingBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get completed bookings for a user
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<Booking>> getCompletedBookings(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getCompletedBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get cancelled bookings for a user
    @GetMapping("/user/{userId}/cancelled")
    public ResponseEntity<List<Booking>> getCancelledBookings(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getCancelledBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // Cancel a booking
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
        try {
            Booking cancelledBooking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(cancelledBooking);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Update booking status
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String bookingId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Booking updatedBooking = bookingService.updateBookingStatus(bookingId, status);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Update payment status
    @PutMapping("/{bookingId}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable String bookingId, @RequestBody Map<String, String> request) {
        try {
            String paymentStatus = request.get("paymentStatus");
            String paymentId = request.get("paymentId");
            Booking updatedBooking = bookingService.updatePaymentStatus(bookingId, paymentStatus, paymentId);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Check if user owns booking
    @GetMapping("/{bookingId}/user/{userId}/is-owner")
    public ResponseEntity<Map<String, Boolean>> isUserOwner(@PathVariable String bookingId, @PathVariable String userId) {
        boolean isOwner = bookingService.isUserOwnerOfBooking(userId, bookingId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isOwner", isOwner);
        return ResponseEntity.ok(response);
    }

    // Get bookings by status for a user
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable String userId, @PathVariable String status) {
        List<Booking> bookings = bookingService.getUserBookingsByStatus(userId, status);
        return ResponseEntity.ok(bookings);
    }
}
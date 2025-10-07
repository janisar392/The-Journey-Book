package com.janisar.service;

import com.janisar.entity.Booking;
import com.janisar.repository.BookingRepository;
import com.janisar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        // Validate user exists
        if (!userRepository.existsById(booking.getUserId())) {
            throw new RuntimeException("User not found with id: " + booking.getUserId());
        }

        // Set initial status based on payment method
        if ("online".equals(booking.getPaymentMethod())) {
            booking.setStatus("confirmed");
            booking.setPaymentStatus("completed");
        } else {
            booking.setStatus("pending_payment");
            booking.setPaymentStatus("pending");
        }

        booking.setBookingDate(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    // Get all bookings for a user
    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get booking by booking ID
    public Optional<Booking> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    // Get booking by ID
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    // Get upcoming bookings for a user
    public List<Booking> getUpcomingBookings(String userId) {
        return bookingRepository.findUpcomingBookingsByUserId(userId);
    }

    // Get completed bookings for a user
    public List<Booking> getCompletedBookings(String userId) {
        return bookingRepository.findCompletedBookingsByUserId(userId);
    }

    // Get cancelled bookings for a user
    public List<Booking> getCancelledBookings(String userId) {
        return bookingRepository.findCancelledBookingsByUserId(userId);
    }

    // Cancel a booking
    public Booking cancelBooking(String bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("cancelled");
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    // Update booking status
    public Booking updateBookingStatus(String bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    // Update payment status
    public Booking updatePaymentStatus(String bookingId, String paymentStatus, String paymentId) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setPaymentStatus(paymentStatus);
            if (paymentId != null) {
                booking.setPaymentId(paymentId);
            }
            // If payment is completed and was pending, update status to confirmed
            if ("completed".equals(paymentStatus) && "pending_payment".equals(booking.getStatus())) {
                booking.setStatus("confirmed");
            }
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    // Check if user owns the booking
    public boolean isUserOwnerOfBooking(String userId, String bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        return bookingOpt.isPresent() && userId.equals(bookingOpt.get().getUserId());
    }

    // Get bookings by status for a user
    public List<Booking> getUserBookingsByStatus(String userId, String status) {
        return bookingRepository.findByUserIdAndStatus(userId, status);
    }
}
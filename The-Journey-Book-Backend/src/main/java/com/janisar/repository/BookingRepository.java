package com.janisar.repository;

import com.janisar.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Find all bookings by user ID
    List<Booking> findByUserId(String userId);

    // Find bookings by user ID and status
    List<Booking> findByUserIdAndStatus(String userId, String status);

    // Find booking by booking ID (the frontend generated ID)
    Optional<Booking> findByBookingId(String bookingId);

    // Find bookings by status
    List<Booking> findByStatus(String status);

    // Find bookings by experience ID
    List<Booking> findByExperienceId(String experienceId);

    // Find upcoming bookings (status confirmed or pending_payment with future dates)
    @Query("{ 'userId': ?0, 'status': { $in: ['confirmed', 'pending_payment'] } }")
    List<Booking> findUpcomingBookingsByUserId(String userId);

    // Find completed bookings
    @Query("{ 'userId': ?0, 'status': 'completed' }")
    List<Booking> findCompletedBookingsByUserId(String userId);

    // Find cancelled bookings
    @Query("{ 'userId': ?0, 'status': 'cancelled' }")
    List<Booking> findCancelledBookingsByUserId(String userId);

    // Check if booking exists by booking ID
    boolean existsByBookingId(String bookingId);
}
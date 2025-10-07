export const generateTextTicket = (booking, user) => {
  const ticketContent = `
🎫 THE JOURNEY BOOK - EXPERIENCE TICKET
========================================

EXPERIENCE DETAILS:
-------------------
Name: ${booking.experience.name}
Location: ${booking.experience.location}
Duration: ${booking.experience.duration}
Experience Date: ${new Date(booking.selectedDate).toLocaleDateString()}

BOOKING INFORMATION:
-------------------
Booking ID: ${booking.id}
Status: ${booking.status.toUpperCase()}
Booked On: ${new Date(booking.bookingDate).toLocaleDateString()}

GUEST INFORMATION:
-----------------
Name: ${booking.guestDetails.fullName}
Email: ${booking.guestDetails.email}
Phone: ${booking.guestDetails.phone}
${booking.guestDetails.specialRequests ? `Special Requests: ${booking.guestDetails.specialRequests}` : ''}

TICKET DETAILS:
---------------
${Object.entries(booking.ticketQuantities)
  .map(([type, quantity]) => quantity > 0 ? `${type.charAt(0).toUpperCase() + type.slice(1)}: ${quantity} ticket(s)` : '')
  .filter(Boolean)
  .join('\n')}

PAYMENT INFORMATION:
-------------------
Total Paid: ₹${booking.totalPrice}
Payment Method: ${booking.paymentMethod === 'online' ? 'Online' : 'Pay at Venue'}
${booking.paymentId ? `Payment ID: ${booking.paymentId}` : ''}

IMPORTANT INFORMATION:
----------------------
• Please arrive 15 minutes before your scheduled time
• Bring a valid photo ID for verification
• Show this ticket at the entrance (digital or printed)
• Free cancellation available up to 24 hours before
${booking.paymentMethod === 'venue' ? '• Payment will be collected when you check in' : ''}

CONTACT SUPPORT:
----------------
Email: support@journeybook.com
Phone: +1 (555) 123-4567

Generated on: ${new Date().toLocaleString()}
Thank you for choosing The Journey Book! 🌍
  `.trim();

  // Create and download text file
  const blob = new Blob([ticketContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `JourneyBook_Ticket_${booking.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};
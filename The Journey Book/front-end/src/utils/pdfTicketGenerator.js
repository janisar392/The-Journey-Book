import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generatePDFTicket = async (booking, user) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    
    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;

    // Header with background
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: rgb(0.4, 0.5, 0.9),
    });

    page.drawText('THE JOURNEY BOOK', {
      x: 50,
      y: yPosition - 30,
      size: 24,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText('EXPERIENCE TICKET', {
      x: 50,
      y: yPosition - 60,
      size: 14,
      font: font,
      color: rgb(1, 1, 1),
    });

    yPosition -= 120;

    // Status Badge
    const statusColor = booking.status === 'cancelled' ? rgb(0.9, 0.3, 0.3) : 
                       booking.status === 'completed' ? rgb(0.3, 0.3, 0.9) : 
                       rgb(0.2, 0.7, 0.3);
    
    page.drawRectangle({
      x: 50,
      y: yPosition - 25,
      width: 120,
      height: 25,
      color: statusColor,
      borderColor: statusColor,
      borderWidth: 1,
    });

    page.drawText(booking.status.toUpperCase(), {
      x: 60,
      y: yPosition - 18,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    yPosition -= 60;

    // Experience Details
    page.drawText('EXPERIENCE DETAILS', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 30;
    page.drawText(`Name: ${booking.experience.name}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Location: ${booking.experience.location}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Duration: ${booking.experience.duration}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Date: ${new Date(booking.selectedDate).toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 40;

    // Booking Information
    page.drawText('BOOKING INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 30;
    page.drawText(`Booking ID: ${booking.id}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Booked On: ${new Date(booking.bookingDate).toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 40;

    // Guest Information
    page.drawText('GUEST INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 30;
    page.drawText(`Name: ${booking.guestDetails.fullName}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Email: ${booking.guestDetails.email}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Phone: ${booking.guestDetails.phone}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    if (booking.guestDetails.specialRequests) {
      yPosition -= 20;
      page.drawText(`Special Requests: ${booking.guestDetails.specialRequests}`, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    yPosition -= 40;

    // Ticket Details
    page.drawText('TICKET DETAILS', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 30;
    Object.entries(booking.ticketQuantities).forEach(([type, quantity]) => {
      if (quantity > 0) {
        page.drawText(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${quantity} ticket(s)`, {
          x: 50,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= 20;
      }
    });

    yPosition -= 20;

    // Payment Information - FIXED: Replace ₹ with INR or RS
    page.drawText('PAYMENT INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 30;
    page.drawText(`Total Paid: INR ${booking.totalPrice}`, { // Changed ₹ to INR
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    page.drawText(`Payment Method: ${booking.paymentMethod === 'online' ? 'Online' : 'Pay at Venue'}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    if (booking.paymentId) {
      yPosition -= 20;
      page.drawText(`Payment ID: ${booking.paymentId}`, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    yPosition -= 40;

    // Important Information
    page.drawText('IMPORTANT INFORMATION', {
      x: 50,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    const instructions = [
      'Please arrive 15 minutes before your scheduled time',
      'Bring a valid photo ID for verification',
      'Show this ticket at the entrance (digital or printed)',
      'Free cancellation available up to 24 hours before'
    ];

    if (booking.paymentMethod === 'venue') {
      instructions.push('Payment will be collected when you check in');
    }

    yPosition -= 30;
    instructions.forEach((instruction) => {
      page.drawText(`- ${instruction}`, { // Changed • to -
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
    });

    // Footer
    page.drawText(`Generated on ${new Date().toLocaleString()}`, {
      x: 50,
      y: 50,
      size: 9,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    page.drawText('Need help? Contact support@journeybook.com', {
      x: 50,
      y: 35,
      size: 9,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JourneyBook_Ticket_${booking.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF ticket');
  }
};
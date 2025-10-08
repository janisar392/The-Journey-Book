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
    
    // Draw colored borders (green on three sides)
    const borderWidth = 8;
    const borderColor = rgb(0.2, 0.7, 0.3); // Green color
    
    // Top border
    page.drawRectangle({
      x: 0,
      y: height - borderWidth,
      width: width,
      height: borderWidth,
      color: borderColor,
    });
    
    // Left border
    page.drawRectangle({
      x: 0,
      y: 0,
      width: borderWidth,
      height: height,
      color: borderColor,
    });
    
    // Right border
    page.drawRectangle({
      x: width - borderWidth,
      y: 0,
      width: borderWidth,
      height: height,
      color: borderColor,
    });

    // Background watermark with light text - MORE VISIBLE VERSION
   page.drawText('THE JOURNEY BOOK', {
    x: 100,
    y: height / 2,
    size: 48,
    font: fontBold,
    color: rgb(0.5, 0.6, 0.5),
    opacity: 0.15,
    });

    page.drawText('THE JOURNEY BOOK', {
    x: 150,
    y: height / 3,
    size: 36,
    font: fontBold,
    color: rgb(0.5, 0.61, 0.6),
    opacity: 0.12,
    });

    page.drawText('THE JOURNEY BOOK', {
    x: 200,
    y: height * 0.7,
    size: 42,
    font: fontBold,
    color: rgb(0.55, 0.65, 0.65),
    opacity: 0.1,
    });

    let yPosition = height - 50;

    // Header with gradient-like background
    page.drawRectangle({
      x: borderWidth,
      y: height - 120,
      width: width - (borderWidth * 2),
      height: 70,
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
      y: yPosition - 55,
      size: 14,
      font: font,
      color: rgb(1, 1, 1),
    });

    // Powered by text
    page.drawText('powered by Janisar Akhtar', {
      x: width - 180,
      y: yPosition - 55,
      size: 10,
      font: font,
      color: rgb(0.8, 0.9, 1),
    });

    yPosition -= 120;

    // Status Badge with improved design
    const statusColor = booking.status === 'cancelled' ? rgb(0.9, 0.3, 0.3) : 
                       booking.status === 'completed' ? rgb(0.3, 0.3, 0.9) : 
                       rgb(0.2, 0.7, 0.3);
    
    page.drawRectangle({
      x: 50,
      y: yPosition - 30,
      width: 140,
      height: 30,
      color: statusColor,
      borderColor: rgb(0.1, 0.1, 0.1),
      borderWidth: 1,
    });

    page.drawText(`${booking.status.toUpperCase()}`, {
      x: 60,
      y: yPosition - 20,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    yPosition -= 60;

    // Section divider
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: width - 100,
      height: 2,
      color: rgb(0.8, 0.8, 0.8),
    });

    yPosition -= 20;

    // Experience Details with icon-like design
    page.drawText('EXPERIENCE DETAILS', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
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

    // Section divider
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: width - 100,
      height: 1,
      color: rgb(0.9, 0.9, 0.9),
    });

    yPosition -= 20;

    // Booking Information
    page.drawText('BOOKING INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
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

    // Section divider
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: width - 100,
      height: 1,
      color: rgb(0.9, 0.9, 0.9),
    });

    yPosition -= 20;

    // Guest Information
    page.drawText('GUEST INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
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

    // Section divider
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: width - 100,
      height: 1,
      color: rgb(0.9, 0.9, 0.9),
    });

    yPosition -= 20;

    // Ticket Details
    page.drawText('TICKET DETAILS', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
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

    // Section divider
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: width - 100,
      height: 1,
      color: rgb(0.9, 0.9, 0.9),
    });

    yPosition -= 20;

    // Payment Information
    page.drawText('PAYMENT INFORMATION', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
    });

    yPosition -= 30;
    page.drawText(`Total Paid: INR ${booking.totalPrice}`, {
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

    // Important Information with colored background
    page.drawRectangle({
      x: 40,
      y: yPosition - 140,
      width: width - 80,
      height: 130,
      color: rgb(0.95, 0.97, 0.95),
      borderColor: rgb(0.8, 0.9, 0.8),
      borderWidth: 1,
    });

    page.drawText('IMPORTANT INFORMATION', {
      x: 50,
      y: yPosition - 30,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.5, 0.2),
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

    yPosition -= 50;
    instructions.forEach((instruction) => {
      page.drawText(`- ${instruction}`, {
        x: 55,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 15;
    });

    // Footer with gradient background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 40,
      color: rgb(0.9, 0.95, 0.9),
    });

    page.drawText(`Generated on ${new Date().toLocaleString()}`, {
      x: 50,
      y: 25,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText('Need help? Contact support@journeybook.com', {
      x: 50,
      y: 10,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
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
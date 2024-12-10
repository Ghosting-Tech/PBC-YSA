import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

export const processBookingData = (bookings) => {
  // Get the date range for the last 9 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 8);

  // Create an array of all months in the range
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  // Initialize the data with 0 bookings for each month
  const monthlyData = months.map((month) => ({
    month: format(month, "MMM"),
    count: 0,
  }));

  // Count bookings for each month
  bookings.forEach((booking) => {
    const bookingDate = parseISO(booking.createdAt);
    const monthIndex = months.findIndex(
      (month) =>
        bookingDate >= startOfMonth(month) && bookingDate <= endOfMonth(month)
    );

    if (monthIndex !== -1) {
      monthlyData[monthIndex].count += 1;
    }
  });

  return monthlyData;
};

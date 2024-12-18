import { Input } from "@material-tailwind/react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "sonner";

const RescheduleBooking = ({ booking, setBooking }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [loading, setLoading] = useState(false);

  const handler = () => {
    setOpen(!open);
  };

  const generateTimeSlots = () => {
    const times = [];
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 48; i++) {
      const hours = start.getHours();
      const minutes = start.getMinutes();
      times.push(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );
      start.setMinutes(start.getMinutes() + 30);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const handleRescheduling = async () => {
    setLoading(true);
    try {
      const date = new Date(selectedDate); // Convert selectedDate to Date object
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; // Format date as DD-MM-YYYY
      const payload = {
        date: formattedDate,
        time: selectedTime,
      };
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Booking rescheduled successfully");
        setSelectedDate("");
        setSelectedTime("");
        handler();
        setBooking(data);
      } else {
        toast.error("Failed to reschedule booking. Please try again.");
      }
    } catch (error) {
      console.log("Error rescheduling booking:", error);
      toast.error("Failed to reschedule booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button size="sm" variant="outlined" color="red" onClick={handler}>
        Reschedule
      </Button>
      <Dialog
        open={open}
        handler={setOpen}
        animate={{
          mount: {
            opacity: 1,
            y: 0,
            scale: 1,
          },
          unmount: {
            opacity: 0,
            y: 0,
            scale: 0.9,
          },
        }}
      >
        <DialogHeader>Reschedule Booking</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p>Please select a new date and time for the booking.</p>
          <input
            type="date"
            placeholder="Select Date"
            format="DD-MM-YYYY"
            className="w-full border rounded p-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="w-full border rounded p-2"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="" disabled>
              Select Time
            </option>
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="text" onClick={handler}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="green"
            onClick={handleRescheduling}
            loading={loading}
            disabled={!selectedDate || !selectedTime || loading}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RescheduleBooking;

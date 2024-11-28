import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ClockIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import TicketStatusChip from "./TicketStatusChip";
import HTMLContentRenderer from "./HTMLContentRenderer";
import { toast } from "sonner";
import { useState } from "react";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  forAdmin,
  setTickets,
  setSelectedTicket,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!ticket) return null;

  const toggleStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus =
        ticket.status === "resolved" ? "unresolved" : "resolved";

      const response = await fetch(`/api/tickets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, ticketId: ticket._id }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setSelectedTicket(data.data);

      setTickets((prevTickets) =>
        prevTickets.map((prevTicket) =>
          prevTicket._id === ticket._id ? data.data : prevTicket
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="lg">
      <DialogHeader>Ticket Details</DialogHeader>
      <DialogBody divider className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1">
              <UserIcon className="h-5 w-5" />
              <Typography variant="h6" color="blue-gray" className="mb-1">
                {ticket.name}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <EnvelopeIcon className="h-4 w-4" />
              <Typography variant="small" color="gray">
                {ticket.email}
              </Typography>
            </div>
          </div>
          <div className="flex justify-end">
            <TicketStatusChip status={ticket.status} />
          </div>
        </div>
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Issue Description
        </Typography>
        <Typography variant="paragraph" color="gray" className="mb-4">
          <HTMLContentRenderer content={ticket.issue} limit={10000} />
        </Typography>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="w-4 h-4 mr-1" />
          Created: {new Date(ticket.createdAt).toLocaleString()}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          Close
        </Button>
        {forAdmin &&
          (ticket.status === "unresolved" ? (
            <Button
              loading={isLoading}
              variant="gradient"
              color="green"
              onClick={toggleStatus}
            >
              Mark as Resolved
            </Button>
          ) : (
            <Button
              loading={isLoading}
              variant="gradient"
              color="red"
              onClick={toggleStatus}
            >
              Mark as Unresolved
            </Button>
          ))}
      </DialogFooter>
    </Dialog>
  );
};

export default TicketDetailsModal;

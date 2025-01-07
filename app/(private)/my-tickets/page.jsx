"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import { useSelector } from "react-redux";
import TicketContainer from "@/components/tickets/TicketContainer";

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <LuLoader className="w-12 h-12 animate-spin text-[var(--color)] " />
  </div>
);

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tickets?user=${user?._id}`);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setTickets(data.tickets);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTickets();
    //eslint-disable-next-line
  }, [user]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <TicketContainer
        tickets={tickets}
        handleViewDetails={handleViewDetails}
        handleRefresh={fetchTickets}
      />
      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ticket={selectedTicket}
        forAdmin={false}
      />
    </div>
  );
};

export default TicketList;

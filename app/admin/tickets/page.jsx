"use client";

import { Suspense, useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import TicketContainer from "./components/TicketContainer";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationBtn from "@/components/PaginationBtn";
import { toast } from "sonner";

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <LuLoader className="w-12 h-12 animate-spin text-[var(--color)] " />
  </div>
);

const TicketListContent = () => {
  const [tickets, setTickets] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const ITEMS_PER_PAGE = 50;

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || 1;
  const activeTab = searchParams.get("status") || "all";
  const searchTerm = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const sortByRole = searchParams.get("sortByRole") || "both";
  const selectedCategory = searchParams.get("category") || "all";

  const fetchTicketsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/tickets?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}&sortBy=${sortBy}&status=${activeTab}&sortByRole=${sortByRole}&category=${selectedCategory}`
      );
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
        setTotalPages(data.totalPages);
        setTotalTickets(data.totalTickets);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error fetching tickets");
      console.log("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsData();
    // eslint-disable-next-line
  }, [page, searchTerm, sortBy, activeTab, sortByRole, selectedCategory]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const updateQueryParams = (newParams) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/admin/tickets${query}`);
  };

  const handleSearch = (value) => {
    updateQueryParams({ search: value, page: 1 });
  };

  const handleTabChange = (tab) => {
    updateQueryParams({ status: tab, page: 1 });
  };

  const handleSortChange = (sort) => {
    updateQueryParams({ sortBy: sort, page: 1 });
  };
  const handleSortByRoleChange = (sort) => {
    updateQueryParams({ sortByRole: sort, page: 1 });
  };
  const handleCategoryChange = (category) => {
    updateQueryParams({ category: category, page: 1 });
  };

  // if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <TicketContainer
        tickets={tickets}
        fetchTickets={fetchTicketsData}
        forAdmin={false}
        setActiveTab={handleTabChange}
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        handleViewDetails={handleViewDetails}
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
        sortBy={sortBy}
        setSortBy={handleSortChange}
        totalTickets={totalTickets}
        sortByRole={sortByRole}
        loading={loading}
        setSortByRole={handleSortByRoleChange}
      />
      <PaginationBtn totalPages={totalPages} />
      <TicketDetailsModal
        isOpen={isModalOpen}
        setTickets={setTickets}
        onClose={closeModal}
        setSelectedTicket={setSelectedTicket}
        ticket={selectedTicket}
        forAdmin={true}
      />
    </div>
  );
};

const TicketList = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TicketListContent />
    </Suspense>
  );
};

export default TicketList;

import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { TicketIcon } from "@heroicons/react/24/outline";
import TicketCard from "./TicketCard";
import {
  FilterIcon,
  RefreshCcw,
  RefreshCcwDot,
  RefreshCw,
  RefreshCwIcon,
  RefreshCwOffIcon,
} from "lucide-react";
import { IoRefreshSharp } from "react-icons/io5";
import { IoIosRefresh } from "react-icons/io";

const TicketContainer = ({ tickets, handleViewDetails, handleRefresh }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTickets = useMemo(() => {
    return tickets?.filter((ticket) => {
      const matchesStatus =
        activeTab === "all" ||
        (activeTab === "unresolved" && ticket.status !== "resolved") ||
        (activeTab === "resolved" && ticket.status === "resolved");

      const matchesCategory =
        selectedCategory === "all" || ticket.category === selectedCategory;

      return matchesStatus && matchesCategory;
    });
  }, [tickets, activeTab, selectedCategory]);

  const renderTickets = (ticketList) =>
    ticketList.map((ticket) => (
      <TicketCard
        key={ticket._id}
        ticket={ticket}
        onViewDetails={handleViewDetails}
      />
    ));

  const tabs = [
    { value: "all", label: "All Tickets" },
    { value: "unresolved", label: "Unresolved" },
    { value: "resolved", label: "Resolved" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "refund", label: "Refund" },
    { value: "payouts", label: "Payouts" },
    { value: "other", label: "Other" },
  ];

  return (
    <Card className="w-full max-w-[68rem] mx-auto">
      <CardHeader
        color="blue"
        className="relative h-24 flex justify-center items-center"
      >
        <Typography variant="h3" color="white">
          Support Tickets
        </Typography>
      </CardHeader>

      <CardBody>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Tabs value={activeTab}>
              <div className="flex items-center justify-between my-2 px-2">
                <Typography
                  variant="h5"
                  color="blue"
                  className="hidden md:block"
                >
                  Filter by Category
                </Typography>
                <div className="w-full md:w-fit flex items-center gap-2">
                  <div className="w-full md:w-72">
                    <Select
                      label="Filter by Category"
                      value={selectedCategory}
                      onChange={(value) => setSelectedCategory(value)}
                    >
                      {categories.map(({ value, label }) => (
                        <Option
                          key={value}
                          value={value}
                          className="w-full list-none"
                        >
                          {label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <IconButton variant="outlined" color="blue">
                    <RefreshCwIcon
                      className="h-6 w-6"
                      onClick={handleRefresh}
                    />
                  </IconButton>
                </div>
              </div>
              <TabsHeader className="w-full flex items-center justify-between">
                {tabs.map(({ value, label }) => (
                  <Tab
                    key={value}
                    value={value}
                    className="w-full"
                    onClick={() => setActiveTab(value)}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>

              <TabsBody
                animate={{
                  initial: { y: 250 },
                  mount: { y: 0 },
                  unmount: { y: 250 },
                }}
              >
                {tabs.map(({ value }) => (
                  <TabPanel key={value} value={value} className="p-0 md:p-4">
                    {filteredTickets?.length > 0 ? (
                      renderTickets(filteredTickets)
                    ) : (
                      <div className="text-center py-12">
                        <TicketIcon className="mx-auto h-16 w-16 text-blue-gray-300" />
                        <Typography color="blue-gray" className="mt-4">
                          No tickets found
                        </Typography>
                      </div>
                    )}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TicketContainer;

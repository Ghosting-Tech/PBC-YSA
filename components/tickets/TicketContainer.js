import { useMemo, useState } from "react";
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
} from "@material-tailwind/react";
import { TicketIcon } from "@heroicons/react/24/outline";
import TicketCard from "./TicketCard";

const TicketContainer = ({ tickets, handleViewDetails }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Filter tickets based on active tab
  const filteredTickets = useMemo(() => {
    switch (activeTab) {
      case "unresolved":
        return tickets?.filter((ticket) => ticket.status !== "resolved");
      case "resolved":
        return tickets?.filter((ticket) => ticket.status === "resolved");
      default:
        return tickets;
    }
  }, [tickets, activeTab]);

  // Render ticket cards
  const renderTickets = (ticketList) =>
    ticketList.map((ticket) => (
      <TicketCard
        key={ticket._id}
        ticket={ticket}
        onViewDetails={handleViewDetails}
      />
    ));

  // Tab configuration
  const tabs = [
    { value: "all", label: "All Tickets" },
    { value: "unresolved", label: "Unresolved" },
    { value: "resolved", label: "Resolved" },
  ];

  return (
    <Card className="mt-6">
      <CardHeader
        color="blue"
        className="relative h-20 flex justify-center items-center"
      >
        <Typography variant="h3" color="white">
          Support Tickets
        </Typography>
      </CardHeader>
      <CardBody>
        <Tabs value={activeTab} className="mb-8">
          <TabsHeader>
            {tabs.map(({ value, label }) => (
              <Tab
                key={value}
                value={value}
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
                    <TicketIcon className="mx-auto h-16 w-16 text-gray-400" />
                    <Typography color="gray" className="mt-4">
                      No tickets found
                    </Typography>
                  </div>
                )}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default TicketContainer;

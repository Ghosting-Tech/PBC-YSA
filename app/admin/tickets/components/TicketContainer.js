import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import {
  TicketIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import TicketCard from "@/components/tickets/TicketCard";

const TicketContainer = ({
  tickets,
  fetchTickets,
  handleViewDetails,
  setActiveTab,
  activeTab,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  totalTickets,
}) => {
  const handleTabChange = (value) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(value);
    }
  };

  const renderTickets = () =>
    tickets.map((ticket) => (
      <TicketCard
        key={ticket._id}
        ticket={ticket}
        onViewDetails={handleViewDetails}
      />
    ));
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
      <CardBody className="p-4 md:p-6">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              color="blue"
              variant="text"
              className="flex items-center gap-2"
              onClick={fetchTickets}
            >
              <ArrowPathIcon className="h-4 w-4" /> Refresh
            </Button>
            <Typography variant="h6" color="blue-gray">
              {totalTickets} Tickets
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-52 md:w-72">
              <Input
                label="Search tickets"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover placement="bottom-end">
              <PopoverHandler>
                <Button variant="text" className="flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />{" "}
                  <div className="hidden md:block">Sort</div>
                </Button>
              </PopoverHandler>
              <PopoverContent className="p-2 z-50">
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    color={sortBy === "newest" ? "blue" : "gray"}
                    variant={sortBy === "newest" ? "filled" : "text"}
                    onClick={() => setSortBy("newest")}
                    fullWidth
                  >
                    Newest First
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "oldest" ? "blue" : "gray"}
                    variant={sortBy === "oldest" ? "filled" : "text"}
                    onClick={() => setSortBy("oldest")}
                    fullWidth
                  >
                    Oldest First
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "nameAsc" ? "blue" : "gray"}
                    variant={sortBy === "nameAsc" ? "filled" : "text"}
                    onClick={() => setSortBy("nameAsc")}
                    fullWidth
                  >
                    Name A-Z
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "nameDesc" ? "blue" : "gray"}
                    variant={sortBy === "nameDesc" ? "filled" : "text"}
                    onClick={() => setSortBy("nameDesc")}
                    fullWidth
                  >
                    Name Z-A
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Tabs value={activeTab} className="mb-8">
          <TabsHeader>
            <Tab value="all" onClick={() => handleTabChange("all")}>
              All Tickets
            </Tab>
            <Tab
              value="unresolved"
              onClick={() => handleTabChange("unresolved")}
            >
              Unresolved
            </Tab>
            <Tab value="resolved" onClick={() => handleTabChange("resolved")}>
              Resolved
            </Tab>
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            <TabPanel value="all" className="p-0">
              {renderTickets()}
            </TabPanel>
            <TabPanel value="unresolved">{renderTickets()}</TabPanel>
            <TabPanel value="resolved">{renderTickets()}</TabPanel>
          </TabsBody>
        </Tabs>
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <TicketIcon className="mx-auto h-16 w-16 text-gray-400" />
            <Typography color="gray" className="mt-4">
              No tickets found
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TicketContainer;

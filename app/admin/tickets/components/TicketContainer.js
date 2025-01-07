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
  Select,
  Option,
} from "@material-tailwind/react";
import {
  TicketIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import TicketCard from "@/components/tickets/TicketCard";
import { LuLoader } from "react-icons/lu";

const Loading = () => (
  <div className="flex justify-center items-center min-h-72">
    <LuLoader className="w-12 h-12 animate-spin text-[var(--color)] " />
  </div>
);

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
  sortByRole,
  setSortByRole,
  loading,
  selectedCategory,
  setSelectedCategory,
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
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "refund", label: "Refund" },
    { value: "payouts", label: "Payouts" },
    { value: "other", label: "Other" },
  ];
  return (
    <Card className="mt-6">
      <CardHeader
        color="purple"
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
              color="purple"
              variant="text"
              className="flex items-center gap-2"
              onClick={fetchTickets}
            >
              <ArrowPathIcon className="h-4 w-4" /> Refresh
            </Button>
            <Typography variant="h6" color="purple-gray">
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
                  <div className="hidden md:block">Sort By role</div>
                </Button>
              </PopoverHandler>
              <PopoverContent className="p-2 z-50">
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    color={sortByRole === "both" ? "purple" : "gray"}
                    variant={sortByRole === "both" ? "gradient" : "text"}
                    onClick={() => setSortByRole("both")}
                    fullWidth
                  >
                    Both
                  </Button>
                  <Button
                    size="sm"
                    color={sortByRole === "user" ? "purple" : "gray"}
                    variant={sortByRole === "user" ? "gradient" : "text"}
                    onClick={() => setSortByRole("user")}
                    fullWidth
                  >
                    Users
                  </Button>
                  <Button
                    size="sm"
                    color={sortByRole === "provider" ? "purple" : "gray"}
                    variant={sortByRole === "provider" ? "gradient" : "text"}
                    onClick={() => setSortByRole("provider")}
                    fullWidth
                  >
                    Providers
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
                    color={sortBy === "newest" ? "purple" : "gray"}
                    variant={sortBy === "newest" ? "filled" : "text"}
                    onClick={() => setSortBy("newest")}
                    fullWidth
                  >
                    Newest First
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "oldest" ? "purple" : "gray"}
                    variant={sortBy === "oldest" ? "filled" : "text"}
                    onClick={() => setSortBy("oldest")}
                    fullWidth
                  >
                    Oldest First
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "nameAsc" ? "purple" : "gray"}
                    variant={sortBy === "nameAsc" ? "filled" : "text"}
                    onClick={() => setSortBy("nameAsc")}
                    fullWidth
                  >
                    Name A-Z
                  </Button>
                  <Button
                    size="sm"
                    color={sortBy === "nameDesc" ? "purple" : "gray"}
                    variant={sortBy === "nameDesc" ? "filled" : "text"}
                    onClick={() => setSortBy("nameDesc")}
                    fullWidth
                  >
                    Name Z-A
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="w-full md:w-56">
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
              {loading ? <Loading /> : renderTickets()}
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

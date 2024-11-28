import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ClockIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import TicketStatusChip from "./TicketStatusChip";
import HTMLContentRenderer from "./HTMLContentRenderer";

const TicketCard = ({ ticket, onViewDetails }) => (
  <Card
    key={ticket._id}
    className="mb-4 overflow-hidden shadow-none border-2 border-blue-500"
  >
    <CardBody className="p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div className="mb-2">
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
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
        <TicketStatusChip status={ticket.status} />
      </div>
      <HTMLContentRenderer content={ticket.issue} limit={100} />
      <div className="flex justify-between flex-col md:flex-row mt-2 gap-2 md:mt-0 items-center text-sm text-gray-500">
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          Created: {new Date(ticket.createdAt).toLocaleString()}
        </div>
        <Button
          size="sm"
          color="blue"
          className="w-full md:w-auto"
          variant="gradient"
          onClick={() => onViewDetails(ticket)}
        >
          View Details
        </Button>
      </div>
    </CardBody>
  </Card>
);

export default TicketCard;

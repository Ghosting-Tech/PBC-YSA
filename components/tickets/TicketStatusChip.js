import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const TicketStatusChip = ({ status }) => {
  const isResolved = status === "resolved";

  return (
    <div
      className={`
      inline-flex items-center px-3 py-2 rounded-full h-fit text-sm font-medium capitalize
      ${isResolved ? "bg-green-500 text-white" : "bg-amber-500 text-black"}
    `}
    >
      {isResolved ? (
        <CheckCircleIcon className="w-4 h-4 mr-0.5" />
      ) : (
        <XCircleIcon className="w-4 h-4 mr-0.5" />
      )}
      <span className="leading-none relative top-px hidden md:block">
        {isResolved ? "Resolved" : "Unresolved"}
      </span>
    </div>
  );
};

export default TicketStatusChip;

import React from "react";
import UserDetail from "./UserDetail";

const UserServiceProviderDetail = ({
  booking,
  forUser = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full mb-6">
      {!forUser && (
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h3 className="text-md md:text-xl font-semibold mb-4 text-gray-800">
            Customer Details
          </h3>
          <UserDetail
            name={booking?.user?.name}
            profileImage={booking?.user?.image}
            email={booking?.user?.email}
            phoneNumber={booking?.user?.phoneNumber}
            gender={booking?.user?.gender}
            religion={booking?.user?.religion}
            access={booking?.acceptedByServiceProvider}
          />
        </div>
      )}
        <div className="bg-white p-6 rounded-lg shadow w-full h-full ">
          {booking.assignedServiceProviders ? (
            <>
              <h3 className="text-md md:text-xl font-semibold mb-4 text-gray-800">
                Assigned Service Provider
              </h3>
              <UserDetail
                name={booking?.assignedServiceProviders?.name}
                profileImage={booking?.assignedServiceProviders?.image}
                email={booking?.assignedServiceProviders?.email}
                phoneNumber={booking?.assignedServiceProviders?.phoneNumber}
                gender={booking?.assignedServiceProviders?.gender}
                religion={booking?.assignedServiceProviders?.religion}
                access={true}
              />
            </>
          ) : (
            <div className="mb-4 py-9 flex flex-col gap-2 items-center justify-center">
              <h3 className="text-md md:text-xl font-semibold text-purple-800">
                Assigned Service Provider
              </h3>
              <div className="text-sm text-gray-500">
                No service provider assigned yet!
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default UserServiceProviderDetail;

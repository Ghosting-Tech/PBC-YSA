import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  FaCalendarCheck,
  FaHistory,
  FaMicroblog,
  FaUser,
} from "react-icons/fa";
import { FaBoxesStacked, FaUsersGear } from "react-icons/fa6";
import Link from "next/link";
import {
  MdDashboardCustomize,
  MdManageAccounts,
  MdOutlineManageHistory,
  MdOutlinePayment,
} from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/userSlice";
import Image from "next/image";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import DutyToggle from "@/components/service-provider/DutyToggle";

const UserNavigation = ({ handleOpenLoginDialog }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.userLoading);

  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "GET",
    });
    toast.success("Logged out successfully!");
    router.push("/");
    dispatch(setUser(null));
  };

  return (
    <>
      {userLoading ? (
        <div className="animate-pulse">
          <Avatar
            as="div"
            variant="circular"
            size="md"
            alt="Profile"
            color="purple-gray"
            className=" p-0.5 cursor-progress"
            src={"/profile.svg"}
          />
        </div>
      ) : user?.role ? (
        <Menu allowHover={true} placement="bottom-start">
          <MenuHandler>
            {user?.image?.url ? (
              <Image
                width={200}
                height={200}
                src={user.image.url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex justify-center items-center font-junge bg-gray-400 cursor-pointer">
                {user.name && Array.from(user.name)[0].toUpperCase()}
              </div>
            )}
          </MenuHandler>
          {user.role === "user" ? (
            <MenuList>
              <Link href={`/user`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Profile <FaUser size={12} />
                </MenuItem>
              </Link>
              <Link href={`/user/bookings?page=1`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Booking <FaCalendarCheck />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
            </MenuList>
          ) : user.role === "service-provider" ? (
            <MenuList
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              className="no-scrollbar"
            >
              <Link href={`/service-provider`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Profile <FaUser size={12} />
                </MenuItem>
              </Link>
              <Link
                href={`/service-provider/booking?page=1`}
                className="outline-none"
              >
                <MenuItem className="justify-center flex items-center gap-1">
                  Booking <FaCalendarCheck />
                </MenuItem>
              </Link>
              <Link
                href={`/service-provider/payment?page=1`}
                className="outline-none"
              >
                <MenuItem className="justify-center flex items-center gap-1">
                  Payment History <MdOutlinePayment />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
              <MenuItem>
                <DutyToggle />
              </MenuItem>
            </MenuList>
          ) : (
            <MenuList>
              <Link href={`/admin`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Admin <MdDashboardCustomize />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      ) : (
        <Button
          size="md"
          className="h-full bg-purple-700 hover:bg-purple-800"
          onClick={handleOpenLoginDialog}
        >
          Login
        </Button>
      )}
    </>
  );
};

export default UserNavigation;

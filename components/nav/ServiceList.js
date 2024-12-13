import {
  Collapse,
  Typography,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { IoIosHelpCircle, IoIosInformationCircle } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaTools } from "react-icons/fa";

const services = [
  {
    title: "Home",
    icon: AiFillHome,
    link: "/",
  },
  {
    title: "All Services",
    icon: FaTools,
    link: "/services",
  },
  {
    title: "About",
    icon: IoIosInformationCircle,
    link: "/about",
  },
  {
    title: "Support",
    icon: IoIosHelpCircle,
    link: "/support",
  },
];
export default function ServicesList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderItems = services.map(({ title, icon, link }, key) => (
    <Link href={link} key={key} className="no-underline">
      <MenuItem className="flex items-center justify-between gap-0 rounded-lg">
        <Typography
          variant="h6"
          color="blue-gray"
          className="flex items-center text-gray-700 text-sm font-semibold"
        >
          {title}
        </Typography>
        <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 ">
          {" "}
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-4 text-gray-700 w-4",
          })}
        </div>
      </MenuItem>
    </Link>
  ));

  return (
    <>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-3 hover:bg-white hover:shadow-lg font-medium text-gray-900 bg-white h-full justify-center rounded-xl shadow"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Go to
              <ChevronDownIcon
                strokeWidth={3.5}
                className={`hidden h-3 w-3 transition-transform lg:block text-blue-500  ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-2xl lg:block min-w-44">
          <ul className="grid grid-cols-1 gap-2 outline-none outline-0 m-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </>
  );
}

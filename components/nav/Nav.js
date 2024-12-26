"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@material-tailwind/react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";

import Logo from "../Logo";
import { setUser, setUserLoading } from "@/redux/slice/userSlice";
import useFcmToken from "@/hook/useFcmToken";
import NavList from "./NavList";
import Profile from "./user-profile/Profile";
import UserNavigation from "./user-profile/UserNavigation";

const MotionIconButton = motion(IconButton);

export default function EnhancedNav() {
  const [openNav, setOpenNav] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const handleOpenLoginDialog = () => setOpenLoginDialog(!openLoginDialog);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.userLoading);

  const { token, notificationPermissionStatus } = useFcmToken(!!user?.name);

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const response = await fetch(`/api/users/check-authorization`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.message === "Unauthorized") {
          return;
        }
        if (!data.success) {
          return toast.error(data.message);
        }
        dispatch(setUser(data.user));
      } catch (err) {
        console.log(err);
        toast.error("Error fetching user");
      } finally {
        dispatch(setUserLoading(false));
      }
    };
    gettingUser();
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, [dispatch]);

  useEffect(() => {
    const updateUserToken = async () => {
      if (user?.name && user.notificationToken !== token) {
        const res = await fetch(`/api/users/update`, {
          method: "POST",
          body: JSON.stringify({
            ...user,
            notificationToken: token,
          }),
        });
        const data = await res.json();
        dispatch(setUser(data));
      }
    };
    updateUserToken();
  }, [user, token, dispatch]);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.3,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  const menuIconVariants = {
    open: { rotate: 180, scale: 1.1 },
    closed: { rotate: 0, scale: 1 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white shadow-md py-3"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div variants={logoVariants}>
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </motion.div>
          <motion.div
            className="hidden lg:flex lg:items-center lg:justify-end w-full"
            variants={itemVariants}
          >
            <NavList />
            <Profile
              openLoginDialog={openLoginDialog}
              handleOpenLoginDialog={handleOpenLoginDialog}
              setOpenLoginDialog={setOpenLoginDialog}
            />
          </motion.div>
          <motion.div
            className="flex items-center lg:hidden"
            variants={itemVariants}
          >
            <MotionIconButton
              variant="text"
              color="blue-gray"
              className="ml-auto"
              onClick={() => setOpenNav(!openNav)}
              animate={openNav ? "open" : "closed"}
              variants={menuIconVariants}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {openNav ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionIconButton>
            <motion.div
              className="flex items-center ml-4"
              variants={itemVariants}
            >
              <UserNavigation
                userLoading={userLoading}
                user={user}
                handleOpenLoginDialog={handleOpenLoginDialog}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {openNav && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavList />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

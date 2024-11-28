"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import NavList from "./NavList";
import Profile from "./user-profile/Profile";
import UserNavigation from "./user-profile/UserNavigation";
import Logo from "../Logo";
import { setUser, setUserLoading } from "@/redux/slice/userSlice";
import useFcmToken from "@/hook/useFcmToken";

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
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        mass: 1,
        duration: 1.5,
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 1,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 1.5,
      },
    },
  };

  const menuIconVariants = {
    open: { rotate: 180, scale: 1.2 },
    closed: { rotate: 0, scale: 1 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, skew: 20 },
    visible: {
      opacity: 1,
      height: "auto",
      skew: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      skew: -20,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  return (
    <motion.div
      className="mx-auto max-w-full px-8 rounded-none shadow-none border-none bg-transparent z-50"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="flex items-center justify-between text-blue-gray-900 bg-transparent">
        <motion.div variants={logoVariants}>
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>
        </motion.div>
        <motion.div
          className="hidden gap-2 lg:flex lg:items-center lg:justify-end w-full"
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
          className="flex items-center justify-end gap-1"
          variants={itemVariants}
        >
          <MotionIconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={openNav ? "open" : "closed"}
            variants={menuIconVariants}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {openNav ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <XMarkIcon className="h-6 w-6" strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bars3Icon className="h-6 w-6" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </MotionIconButton>
          <motion.div
            className="flex w-fit items-center gap-2 lg:hidden"
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
      <AnimatePresence>
        {openNav && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <NavList />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

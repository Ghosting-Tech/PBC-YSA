import { storage } from "@/firebase";
import { Button, Dialog, Input } from "@material-tailwind/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";

const VerifyOtp = ({
  open,
  setOpen,
  generatedOTP,
  inputData,
  setInputData,
  SendingOtp,
  isOtpButtonDisabled,
  setIsOtpButtonDisabled,
  timer,
  setTimer,
  handleOpenResponseDialog,
}) => {
  const handleOpen = () => setOpen(!open);
  const [uploadingLoading, setUploadingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsOtpButtonDisabled(false);
    }
    //eslint-disable-next-line
  }, [timer]);
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleRegisterServiceProvider = async (e) => {
    e.preventDefault();
    if (otp === undefined || otp !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }
    setUploadingLoading(true);

    // Upload Profile Image
    const profileImageRef = ref(
      storage,
      `service-provider/id/${Date.now() + inputData.image.name}`
    );
    await uploadBytes(profileImageRef, inputData.image);
    const profileImageUrl = await getDownloadURL(profileImageRef);

    // cv section
    const cvImageRef = ref(
      storage,
      `service-provider/cv/${Date.now() + inputData.cv.name}`
    );
    await uploadBytes(cvImageRef, inputData.cv);
    const cvImageUrl = await getDownloadURL(cvImageRef);

    // Upload Id1 Image
    const id1ImageRef = ref(
      storage,
      `service-provider/id/${
        inputData.id1.image.file.lastModified +
        inputData.id1.image.file.size +
        inputData.id1.image.file.name
      }`
    );
    await uploadBytes(id1ImageRef, inputData.id1.image.file);
    const id1ImageUrl = await getDownloadURL(id1ImageRef);

    // Upload Id2 Image
    const id2ImageRef = ref(
      storage,
      `service-provider/id/${
        inputData.id2.image.file.lastModified +
        inputData.id2.image.file.size +
        inputData.id2.image.file.name
      }`
    );
    await uploadBytes(id2ImageRef, inputData.id2.image.file);
    const id2ImageUrl = await getDownloadURL(id2ImageRef);

    if (inputData.profession === "physiotherapist") {
      // Ensure certificate and degree files are provided
      if (!inputData.certificate || !inputData.degree) {
        throw new Error("Certificate or Degree files are missing.");
      }

      // Upload certificate image
      const certificateImageRef = ref(
        storage,
        `service-provider/certificate/${Date.now()}_${
          inputData.certificate.name
        }`
      );
      await uploadBytes(certificateImageRef, inputData.certificate);
      const certificateImageUrl = await getDownloadURL(certificateImageRef);

      // Upload degree image
      const degreeImageRef = ref(
        storage,
        `service-provider/degree/${Date.now()}_${
          inputData.degree.image.file.name
        }`
      );
      await uploadBytes(degreeImageRef, inputData.degree.image.file);
      const degreeImageUrl = await getDownloadURL(degreeImageRef);

      // Add certificate and degree to postData
      inputData.certificate = {
        url: certificateImageUrl,
        name: certificateImageRef._location.path_,
      };
      inputData.degree = {
        name: inputData.degree.name,
        image: {
          url: degreeImageUrl,
          name: degreeImageRef._location.path_,
        },
      };
    }

    const postData = {
      ...inputData,
      image: {
        url: profileImageUrl,
        name: profileImageRef._location.path_,
      },
      cv: {
        url: cvImageUrl,
        name: cvImageRef._location.path_,
      },
      certificate: inputData.certificate || {
        url: "",
        name: "",
      },
      id1: {
        name: inputData.id1.name,
        image: {
          url: id1ImageUrl,
          name: id1ImageRef._location.path_,
        },
      },
      id2: {
        name: inputData.id2.name,
        image: {
          url: id2ImageUrl,
          name: id2ImageRef._location.path_,
        },
      },
      degree: inputData.degree || {
        name: "",
        image: {
          url: "",
          name: "",
        },
      },
    };
    try {
      await fetch("/api/service-providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      handleOpenResponseDialog(true);
      setInputData({
        name: "",
        phoneNumber: "",
        email: "",
        image: {
          url: "",
          name: "",
        },
        cv: {
          url: "",
          name: "",
        },
        certificate: {
          url: "",
          name: "",
        },
        id1: {
          name: "",
          image: {
            url: "",
            name: "",
          },
        },
        id2: {
          name: "",
          image: {
            url: "",
            name: "",
          },
        },
        degree: {
          name: "",
          image: {
            url: "",
            name: "",
          },
        },
        gender: "",
        aadhar: "",
        city: "",
        password: "",
        role: "service-provider",
        active: false,
        image: null,
      });
      setUploadingLoading(false);
    } catch (error) {
      handleOpenResponseDialog(true);
      console.log("Something went wroung while regestering.", error);
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      dismiss={{ enabled: false }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-[var(--color)] ">
          Verify OTP
        </h2>
        <form
          onSubmit={handleRegisterServiceProvider}
          className="flex flex-col gap-4"
        >
          <Input
            label="Enter OTP"
            maxLength={4}
            color="purple"
            value={otp}
            size="lg"
            minLength={4}
            onChange={handleChange}
          />

          <p className="text-gray-600 flex gap-1 text-xs items-center">
            <FaInfoCircle />
            <span>
              Please enter the 4-digit OTP sent to your mobile number{" "}
              {inputData.phoneNumber}.
            </span>
          </p>

          <div className="flex gap-4 items-center">
            <Button
              variant="text"
              color="purple-gray"
              className="underline w-full"
              onClick={SendingOtp}
              disabled={isOtpButtonDisabled}
            >
              {isOtpButtonDisabled ? `Resend OTP in ${timer} s` : "Send OTP"}
            </Button>
            <Button
              type="submit"
              color="purple"
              fullWidth
              className="flex justify-center"
              loading={uploadingLoading}
            >
              Verify OTP
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default VerifyOtp;

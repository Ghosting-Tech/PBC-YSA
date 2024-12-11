import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadImage = async (image, pathname) => {
  try {
    // Create a unique filename using timestamp, size, and original name
    const filename = `${image.lastModified}_${image.size}_${image.name}`;

    // Create a reference to the storage location
    const imageRef = ref(storage, `${pathname}/${filename}`);

    // Upload the image
    const snapshot = await uploadBytes(imageRef, image);

    // Get the download URL
    const imageUrl = await getDownloadURL(imageRef);

    // Return an object with the image details
    return {
      url: imageUrl,
      name: snapshot.ref.fullPath, // Use fullPath instead of _location.path_
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw to allow caller to handle the error
  }
};

export default uploadImage;

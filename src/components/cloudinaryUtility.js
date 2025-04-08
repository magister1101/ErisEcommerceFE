import axios from "axios";
import { Notify } from "quasar";

export async function uploadToCloud(file) {
  // Check if file exists
  if (!file) {
    Notify.create({
      type: "negative",
      message: "No file selected. Please select an image to upload.",
    });
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "preset"); // Replace with your unsigned preset name

  try {
    // Perform the upload to Cloudinary
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dvyjiepra/image/upload", // Replace `your-cloud-name` with your Cloudinary account’s cloud name
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Check if the response contains a secure URL
    if (response.data && response.data.secure_url) {
      return response.data.secure_url; // Return the secure URL from Cloudinary
    } else {
      throw new Error("Failed to get secure URL from Cloudinary.");
    }
  } catch (error) {
    console.error("Upload Failed:", error);
    Notify.create({
      type: "warning",
      message: "Upload Failed. Please Try Again.",
    });
    return null; // Return null in case of error
  }
}

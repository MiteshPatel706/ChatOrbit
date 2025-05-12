import { Platform } from "react-native";

export const UploadMediaToServer = async (data, mediaType) => {
  console.log("UploadMediaToGoFile", data, mediaType);

  const UPLOAD_PRESET = "docs_upload_example_us_preset"; // your unsigned preset
  const CLOUD_NAME = "dwkgxygum"; // your Cloudinary name

  if (mediaType == "video") {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri:
          Platform.OS === "ios" ? data?.path.replace("file://", "") : res?.path,
        type: "video/mp4",
        name: data?.name || "video.mp4",
      });
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Uploaded Video URL:", data.secure_url);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  } else {
    return null;
  }
};

export default UploadMediaToServer;

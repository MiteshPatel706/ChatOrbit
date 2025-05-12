import { Video } from "react-native-compressor";

export const CompressMedia = async (data, mediaType) => {
  if (mediaType === "video") {
    const compressedUri = await Video.compress(data?.path, {
      compressionMethod: "auto",
    });
    const compressedData = {
      path: compressedUri,
      type: data?.mime,
      name: data?.name,
    };
    return { compressedData, mediaType };
  } else {
    return null;
  }
};

export default CompressMedia;

import { PermissionsAndroid, Platform } from "react-native";

export const RequestGalleryPermission = async () => {
  if (Platform.OS === "android") {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: "Gallery Permission",
          message: "App needs access to your photos to show the gallery.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  // On iOS, permission is handled via plist, and system auto-prompts
  return true;
};

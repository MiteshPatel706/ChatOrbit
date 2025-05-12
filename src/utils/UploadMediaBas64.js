import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

const UploadMediaBas64 = async (mediaData, mediaType) => {
  try {
    const {path, mime} = mediaData;

    if (!path || !mime) {
      throw new Error('Invalid media data: Missing path or mime');
    }

    if (mediaType === 'image') {
      const format = mime.includes('png') ? 'PNG' : 'JPEG';
      const resizedImage = await ImageResizer.createResizedImage(
        path,
        500, // Max width
        500, // Max height
        format,
        80, // Quality
      );

      const file = await RNFetchBlob.fs.readFile(
        resizedImage.uri.replace('file://', ''),
        'base64',
      );

      return `data:${mime};base64,${file}`;
    } else if (mediaType === 'video') {
      const file = await RNFetchBlob.fs.readFile(
        path.replace('file://', ''), // Remove `file://` if present
        'base64',
      );

      return `data:${mime};base64,${file}`;
    } else {
      throw new Error('Invalid media type');
    }
  } catch (error) {
    console.error('Media upload failed:', error);
    throw error;
  }
};

export default UploadMediaBas64;

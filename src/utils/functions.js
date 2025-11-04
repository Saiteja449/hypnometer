import { PermissionsAndroid, Platform } from 'react-native';

export const requestMediaPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const permissions = [];

      permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (Platform.Version >= 33) {
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
      } else {
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      }

      permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        res => res === PermissionsAndroid.RESULTS.GRANTED,
      );

      return allGranted;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

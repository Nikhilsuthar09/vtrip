import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId: process.env.WEBCLIENTID,
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

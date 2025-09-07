import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../Configs/firebaseConfig";
import { Alert, ToastAndroid } from "react-native";
import { addUserToDb } from "./firebaseUserHandlers";

export const signInGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      console.log(response.data.user.name);
      const idToken = response.data.idToken;
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      if (userCredential.additionalUserInfo?.isNewUser) {
        await addUserToDb();
      } else {
        ToastAndroid.show(
          `Welcome Back ${response.data?.user?.name}`,
          ToastAndroid.SHORT
        );
      }
    } else {
      console.log("google sign in failed");
      Alert.alert("Sign in failed");
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert("In progress", "please wait");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert(
            "Error",
            "Google play services not available currently please try again later"
          );
          break;
        default:
          Alert.alert("Error", "Something went wrong please try again later");
      }
    } else {
      Alert.alert("Error", "Something went wrong please try again later");
    }
  }
};

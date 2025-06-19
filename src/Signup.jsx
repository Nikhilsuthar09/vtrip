import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLOR, FONT_SIZE, FONTS } from "./Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigation } from "expo-router";

const signup = async (email, password, name) => {
  Keyboard.dismiss();
  // input validation
  if (!email.trim()) {
    Alert.alert("Please enter your email");
    return;
  }
  if (!password.trim()) {
    Alert.alert("Please enter your password");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Please enter a valid email address");
    return;
  }
  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters)) {
    Alert.alert("Password must contain atleast 1 lower");
    return;
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (!password.match(upperCaseLetters)) {
    Alert.alert("Password must contain alteast one upper case");
    return;
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if (!password.match(numbers)) {
    Alert.alert("Password must contain alteast one number");
    return;
  }

  // Validate length
  if (password.length <= 8) {
    Alert.alert("Password must contain alteast 8 characters");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Signed in
    const user = userCredential.user;
    console.log(user);
    await signOut(auth)
  } catch (error) {
    let errorMessage = "Authentication failed. Please try again";
    if (error.code === "auth/invalid-email") {
      errorMessage = "Please enter  valid email address";
    } else if (error.code === "auth/invalid-credential") {
      errorMessage =
        "Incorrect email or password. Please check your credentials and try again";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection";
    } else if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use, please login";
    }
    Alert.alert("Error ", errorMessage);
    console.log(error.code);
  }
};

export default function Signup() {
  const email = useRef("");
  const password = useRef("");
  const name = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LinearGradient colors={["#2567E8", "#1CE6DA"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
        keyboardVerticalOffset={1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginContainer}>
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color={COLOR.textPrimary} />
            </Pressable>
            <View style={styles.logintitle}>
              <Text style={styles.loginText}>Sign up </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.signupLinkText}>
                  Already have an account?{" "}
                </Text>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text
                    style={{
                      color: COLOR.secondary,
                      fontFamily: FONTS.semiBold,
                      fontSize: FONT_SIZE.caption,
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => (name.current = value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => (email.current = value)}
                  autoCorrect={false}
                />
              </View>
              <View>
                <Text style={styles.label}>Set Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    onChangeText={(value) => (password.current = value)}
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                  />
                  <Pressable
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <AntDesign
                      name={showPassword ? "eye" : "eyeo"}
                      size={20}
                      color={COLOR.grey}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() =>
                signup(email.current, password.current, name.current)
              }
            >
              <View style={styles.loginbuttonContainer}>
                <Text style={styles.loginbuttontext}>Register</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    display: "flex",
    gap: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
  },
  logintitle: {
    gap: 8,
  },
  loginText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H1,
    color: COLOR.textPrimary,
  },
  signupLinkText: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  loginbuttonContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 16,
    backgroundColor: COLOR.primary,
    width: 275,
  },
  loginbuttontext: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: "#FFFFFF",
    textAlign: "center",
  },
  googleButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
    textAlign: "center",
  },
  input: {
    height: 46,
    width: 275,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  passwordContainer: {
    position: "relative",
    width: 275,
  },
  passwordInput: {
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 45,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 13,
    padding: 2,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    paddingTop: 8,
    paddingBottom: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
});

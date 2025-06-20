import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLOR, FONT_SIZE, FONTS } from "./Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "expo-router";
import { handleFirebaseAuthErrors, handleLoginValidation } from "./AuthHandlers";

const signin = async (email, password) => {
  Keyboard.dismiss();
  // input validation
 if(!handleLoginValidation(email, password)) return 

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Signed in
    const user = userCredential.user;
    // console.log(user)
  } catch (error) {
    const errorMessage = handleFirebaseAuthErrors(error)
    console.log(errorMessage);
    Alert.alert("Error ", errorMessage);
  }
};

export default function AuthScreen() {
  const email = useRef("");
  const password = useRef("");
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
          <View>
            <Text>Logo</Text>
          </View>
          <View style={styles.loginContainer}>
            <View style={styles.logintitle}>
              <Text style={styles.loginText}>Login </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.signupLinkText}>
                  {" "}
                  Don't have an account?{" "}
                </Text>
                <Pressable onPress={() => navigation.push("SignUp")}>
                  <Text
                    style={{
                      color: COLOR.secondary,
                      fontFamily: FONTS.semiBold,
                      fontSize: FONT_SIZE.caption,
                    }}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => (email.current = value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    onChangeText={(value) => (password.current = value)}
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
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
                <Pressable onPress={() => Alert.alert("TODO")}>
                  <Text style={styles.forgotpasswordText}>
                    Forgot Password ?
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.loginbuttons}>
              <Pressable onPress={() => signin(email.current, password.current)}>
                <View style={styles.loginbuttonContainer}>
                  <Text style={styles.loginbuttontext}>Log In</Text>
                </View>
              </Pressable>
              <View style={styles.separater}>
                <View style={styles.separaterLine}></View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.separaterLine}></View>
              </View>
              <Pressable onPress={() => Alert.alert("To Do")}>
                <View style={styles.googleButtonContainer}>
                  <AntDesign name="google" size={18} color="black" />
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
  },
  logintitle: { gap: 8 },
  loginText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H1,
    textAlign: "center",
    color: COLOR.textPrimary,
  },
  signupLinkText: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  inputfieldsContainer: {
    display: "flex",
    gap: 16,
  },
  loginbuttons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
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
  googleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    width: 275,
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
    paddingVertical: 6,
  },
  forgotpasswordText: {
    marginTop: 14,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: COLOR.secondary,
    textAlign: "right",
  },
  separater: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  separaterLine: {
    width: 100,
    height: 1,
    backgroundColor: COLOR.stroke,
  },
  orText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
});

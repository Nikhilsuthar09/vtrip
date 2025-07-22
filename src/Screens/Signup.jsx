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
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Configs/firebaseConfig";
import { useNavigation } from "expo-router";
import {
  handleFirebaseAuthErrors,
  handleSignupValidation,
} from "../utils/AuthHandlers";
import { useAuth } from "../Context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRegistrationState } = useAuth();
  const navigation = useNavigation();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (loading) {
    return null;
  }
  const signup = async () => {
    Keyboard.dismiss();
    // input validation
    if (!handleSignupValidation(email, password, name)) {
      return;
    }
    try {
      setLoading(true);
      setRegistrationState(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });
      console.log(user);
      await signOut(auth);
      setLoading(false);
      setRegistrationState(false);
      navigation.goBack();
    } catch (error) {
      const errorMessage = handleFirebaseAuthErrors(error);
      console.log(errorMessage);
      Alert.alert("Error ", errorMessage);
      setLoading(false);
    }
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
                  placeholder="eg John Doe"
                  placeholderTextColor={COLOR.placeholder}
                  style={styles.input}
                  value={name}
                  onChangeText={(value) => setName(value)}
                />
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@email.com"
                  placeholderTextColor={COLOR.placeholder}
                  onChangeText={(value) => setEmail(value)}
                  value={email}
                  autoCorrect={false}
                />
              </View>
              <View>
                <Text style={styles.label}>Set Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a Password"
                    placeholderTextColor={COLOR.placeholder}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
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
            <Pressable onPress={signup}>
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
